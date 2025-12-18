import React, { useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../shared/Card';
import Input from '../shared/Input';
import { useTranslation } from '../../hooks/useTranslation';
import FlagIcon from '../shared/FlagIcon';
import { useCurrencyConverter } from '../../hooks/useCurrencyConverter';
import SEO from '../shared/SEO';

const CurrencyConverter: React.FC = () => {
    const { t } = useTranslation();
    const {
        formData,
        setAmount,
        setFromCurrency,
        setToCurrency,
        allCurrencies,
        convertedAmount,
        exchangeRate,
        historicalData,
        dailyRates,
        dailyRatesDate,
        isLoading,
        isHistoryLoading,
        isDailyRatesLoading,
        error,
        swapCurrencies,
        handleDailyRateClick,
        DAILY_RATES_CURRENCIES
    } = useCurrencyConverter();
    
    const formatCurrencyDisplay = useCallback((value: number | null, currency: string) => {
        if (value === null) return '-';
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
        } catch (e) {
            return `${currency} ${value.toFixed(2)}`;
        }
    }, []);

    const CurrencySelector = ({ label, value, onChange, currencies }: { label: string, value: string, onChange: (val: string) => void, currencies: string[] }) => (
        <div>
            <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t(label)}</label>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <FlagIcon currency={value} />
                 </div>
                <select 
                    value={value} 
                    onChange={e => onChange(e.target.value)} 
                    className="w-full p-2 pl-10 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none appearance-none"
                    disabled={!currencies.length}
                >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-light-muted">
                   <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
            </div>
        </div>
    );
    
    return (
        <div>
            <SEO titleKey="tab.currencyConverter" descriptionKey="currency-converter.landing.description" />
            <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">{t('currency.title')}</h1>
            
            {error && <Card className="mb-6 border-danger bg-red-50 dark:bg-red-900/50"><p className="text-danger text-center font-semibold">{error}</p></Card>}
            
            <div className="max-w-5xl mx-auto space-y-6">
                 <Card title="currency.dailyRates.title">
                    {isDailyRatesLoading ? (
                         <div className="flex justify-center items-center h-24"><svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>
                    ) : (
                        <>
                            <p className="text-xs text-center text-light-muted dark:text-dark-muted mb-4">{t('currency.dailyRates.updated', { date: dailyRatesDate })}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {DAILY_RATES_CURRENCIES.map(curr => (
                                    <button 
                                        key={curr} 
                                        onClick={() => handleDailyRateClick(curr)}
                                        className="p-3 text-left rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent border border-light-border dark:border-dark-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label={`Select ${curr}`}
                                    >
                                        <div className="flex items-center gap-2 font-bold text-light-text dark:text-dark-text">
                                            <FlagIcon currency={curr} />
                                            <span>{curr}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-lg font-mono text-light-text dark:text-dark-text">{dailyRates[curr]?.toFixed(4)}</span>
                                            <span className="text-xs text-light-muted dark:text-dark-muted"> / BRL</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </Card>

                <Card title={t('currency.convert.cardTitle')}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                            <CurrencySelector label="currency.from.label" value={formData.fromCurrency} onChange={setFromCurrency} currencies={allCurrencies} />
                        </div>
                        
                        <div className="flex justify-center">
                            <button onClick={swapCurrencies} className="p-2 rounded-full hover:bg-light-border dark:hover:bg-dark-border text-light-muted" aria-label={t('currency.swap.ariaLabel')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>
                            </button>
                        </div>
                        
                        <div className="md:col-span-2">
                            <CurrencySelector label="currency.to.label" value={formData.toCurrency} onChange={setToCurrency} currencies={allCurrencies} />
                        </div>
                    </div>

                    <div className="text-center my-6 p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                        {isLoading ? (
                            <p className="text-light-muted dark:text-dark-muted animate-pulse">{t('common.loadingRates')}</p>
                        ) : (
                            <p className="font-semibold text-lg text-light-text dark:text-dark-text animate-fadeIn">
                                1 {formData.fromCurrency} ≈ <span className="text-light-accent-text dark:text-dark-accent-text">{(exchangeRate ?? 0).toFixed(4)}</span> {formData.toCurrency}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
                        <div className="md:col-span-5">
                            <Input label={t('currency.amount.label')} type="number" value={formData.amount} onChange={e => setAmount(e.target.value)} />
                        </div>
                        <div className="text-center text-2xl font-bold text-light-muted dark:text-dark-muted md:col-span-1 pb-2">
                            =
                        </div>
                        <div className="md:col-span-5">
                            <p className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('common.result')}</p>
                            <div className="p-2 border rounded-md bg-light-input dark:bg-dark-input border-light-border dark:border-dark-border min-h-[42px] flex items-center">
                                <span role="status" aria-live="polite" className="text-xl font-bold text-light-accent-text dark:text-dark-accent-text">{formatCurrencyDisplay(convertedAmount, formData.toCurrency)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="currency.history.title">
                    {isHistoryLoading ? (
                         <div className="flex justify-center items-center h-80"><svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>
                    ) : historicalData.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer>
                                <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.3)" />
                                    <XAxis dataKey="date" stroke="currentColor" />
                                    <YAxis stroke="currentColor" domain={['dataMin', 'dataMax']} tickFormatter={(tick) => tick.toFixed(3)} />
                                    <Tooltip formatter={(value: number) => [value.toFixed(4), t('currency.tooltip.rate', { from: formData.fromCurrency, to: formData.toCurrency })]} />
                                    <Line type="monotone" dataKey="rate" name={t('currency.chart.rate', { from: formData.fromCurrency, to: formData.toCurrency })} stroke="#ff0e00" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 w-full flex items-center justify-center text-light-muted dark:text-dark-muted">{t('common.fillDataToCalculate')}</div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CurrencyConverter;