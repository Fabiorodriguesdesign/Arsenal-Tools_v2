import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from './useTranslation';
import { useFormPersistence } from './useFormPersistence';
import { 
    CurrencyFormData, 
    LatestRatesResponse, 
    HistoricalRatesResponse, 
    ChartDataPoint 
} from '../types/currency';

interface CacheData<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const POPULAR_CURRENCIES = ['BRL', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
const DAILY_RATES_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];

const INITIAL_STATE: CurrencyFormData = {
    amount: '100',
    fromCurrency: 'BRL',
    toCurrency: 'USD',
};

// Helper to cache data
const getCachedData = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        const parsed: CacheData<T> = JSON.parse(item);
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            return parsed.data;
        }
        return null;
    } catch {
        return null;
    }
};

const setCachedData = <T>(key: string, data: T) => {
    try {
        const cacheItem: CacheData<T> = { data, timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (e) {
        console.warn('Failed to save to localStorage', e);
    }
};

export const useCurrencyConverter = () => {
    const { t } = useTranslation();
    
    // Persistent Form State
    const [formData, setFormData] = useFormPersistence<CurrencyFormData>('currencyConverterData', INITIAL_STATE);
    
    // Derived UI State
    const [allCurrencies, setAllCurrencies] = useState<string[]>([]);
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [historicalData, setHistoricalData] = useState<ChartDataPoint[]>([]);
    
    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Daily rates state
    const [dailyRates, setDailyRates] = useState<{ [key: string]: number }>({});
    const [dailyRatesDate, setDailyRatesDate] = useState<string>('');
    const [isDailyRatesLoading, setIsDailyRatesLoading] = useState(true);

    // Fetch all available currencies on mount
    useEffect(() => {
        const fetchCurrencies = async () => {
            const cachedCurrencies = getCachedData<string[]>('currency_list');
            if (cachedCurrencies) {
                setAllCurrencies(cachedCurrencies);
                return;
            }

            try {
                const response = await fetch('https://api.frankfurter.app/currencies');
                if (!response.ok) throw new Error(t('currency.error.fetchCurrencies'));
                const data = await response.json();
                const currencyKeys = Object.keys(data);
                const sorted = [
                    ...POPULAR_CURRENCIES.filter(c => currencyKeys.includes(c)),
                    ...currencyKeys.filter(c => !POPULAR_CURRENCIES.includes(c)).sort()
                ];
                setAllCurrencies(sorted);
                setCachedData('currency_list', sorted);
            } catch (err) {
                 if (err instanceof Error) setError(err.message);
                 else setError(t('currency.error.unknown'));
            }
        };
        fetchCurrencies();
    }, [t]);

    // Fetch daily rates
    useEffect(() => {
        const fetchDailyRates = async () => {
            setIsDailyRatesLoading(true);
            const cacheKey = `daily_rates_BRL_${DAILY_RATES_CURRENCIES.join('_')}`;
            const cachedRates = getCachedData<LatestRatesResponse>(cacheKey);
            
            if (cachedRates) {
                 setDailyRates(cachedRates.rates);
                 setDailyRatesDate(new Date(cachedRates.date).toLocaleDateString());
                 setIsDailyRatesLoading(false);
                 return;
            }

            try {
                const response = await fetch(`https://api.frankfurter.app/latest?from=BRL&to=${DAILY_RATES_CURRENCIES.join(',')}`);
                if (!response.ok) throw new Error(t('currency.error.fetchRate'));
                const data: LatestRatesResponse = await response.json();
                setDailyRates(data.rates);
                setDailyRatesDate(new Date(data.date).toLocaleDateString());
                setCachedData(cacheKey, data);
            } catch (err) {
                console.error("Failed to fetch daily rates", err);
            } finally {
                setIsDailyRatesLoading(false);
            }
        };
        fetchDailyRates();
    }, [t]);

    // Fetch exchange rate and historical data when currencies change
    useEffect(() => {
        const { fromCurrency, toCurrency } = formData;
        if (!fromCurrency || !toCurrency || !allCurrencies.length) return;

        if (fromCurrency === toCurrency) {
            setExchangeRate(1);
            setHistoricalData([]);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setIsLoading(true);
            setIsHistoryLoading(true);
            setError(null);
            try {
                // Fetch current rate
                const latestResponse = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`, { signal });
                if (!latestResponse.ok) throw new Error(t('currency.error.fetchRate'));
                const latestData: LatestRatesResponse = await latestResponse.json();
                setExchangeRate(latestData.rates[toCurrency]);
                setIsLoading(false);

                // Fetch historical data
                const endDate = new Date().toISOString().split('T')[0];
                const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const historicalResponse = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`, { signal });
                if (!historicalResponse.ok) throw new Error(t('currency.error.fetchHistory'));
                const historicalJson: HistoricalRatesResponse = await historicalResponse.json();
                
                const formattedData = Object.entries(historicalJson.rates)
                    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                    .map(([date, rates]) => ({
                        date: new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }),
                        rate: rates[toCurrency]
                    }));

                setHistoricalData(formattedData);

            } catch(err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
                setIsHistoryLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();
    }, [formData.fromCurrency, formData.toCurrency, allCurrencies, t]);

    // Calculate converted amount
    useEffect(() => {
        const numAmount = parseFloat(formData.amount) || 0;
        if (exchangeRate !== null) {
            setConvertedAmount(numAmount * exchangeRate);
        }
    }, [formData.amount, exchangeRate]);

    // --- Actions ---

    const setAmount = useCallback((val: string) => {
        setFormData(prev => ({ ...prev, amount: val }));
    }, [setFormData]);

    const setFromCurrency = useCallback((val: string) => {
        setFormData(prev => ({ ...prev, fromCurrency: val }));
    }, [setFormData]);

    const setToCurrency = useCallback((val: string) => {
        setFormData(prev => ({ ...prev, toCurrency: val }));
    }, [setFormData]);

    const swapCurrencies = useCallback(() => {
        setFormData(prev => ({ ...prev, fromCurrency: prev.toCurrency, toCurrency: prev.fromCurrency }));
    }, [setFormData]);

    const handleDailyRateClick = useCallback((currency: string) => {
        setFormData(prev => ({ ...prev, fromCurrency: 'BRL', toCurrency: currency }));
    }, [setFormData]);

    return {
        // Data
        formData,
        allCurrencies,
        convertedAmount,
        exchangeRate,
        historicalData,
        dailyRates,
        dailyRatesDate,
        // Status
        isLoading,
        isHistoryLoading,
        isDailyRatesLoading,
        error,
        // Constants
        DAILY_RATES_CURRENCIES,
        // Actions
        setAmount,
        setFromCurrency,
        setToCurrency,
        swapCurrencies,
        handleDailyRateClick,
    };
};
