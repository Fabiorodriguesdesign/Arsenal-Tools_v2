
import React, { useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '../../hooks/useTranslation';
import FlagIcon from '../shared/FlagIcon';
import { useCurrencyConverter } from '../../hooks/useCurrencyConverter';
import { Icon } from '@/components/icons';

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
        <Select
            label={t(label)}
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={!currencies.length}
            leftIcon={<FlagIcon currency={value} />}
        >
             {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
    );
    
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">{t('currency.title')}</h1>
            
            {error && <Card className="mb-6 border-danger bg-red-50 dark:bg-red-900/50"><p className="text-danger text-center font-semibold">{error}</p></Card>}
            
            <div className="max-w-5xl mx-auto space-y-6">
                 <Card title={t('currency.dailyRates.title')}>
                    {isDailyRatesLoading ? (
                         <div className="flex justify-center items-center h-24"><Icon name="refresh" className="animate-spin h-6 w-6 text-primary" /></div>
                    ) : (
                        <>
                            <p className="text-xs text-center text-light-muted dark:text-dark-muted mb-4">{t('currency.dailyRates.updated', { date: dailyRatesDate })}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {DAILY_RATES_CURRENCIES.map(curr => (
                                    <button 
                                        key={curr} 
                                        onClick={() => handleDailyRateClick(curr)}
                                        className="p-3 text-left rounded-lg hover:bg-light-accent dark:hover:bg-dark-bg border border-light-border dark:border-dark-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue"
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
                        
                        <div className="flex justify-center pt-6">
                            <button onClick={swapCurrencies} className="p-2 rounded-full hover:bg-light-border dark:hover:bg-dark-border text-light-muted" aria-label={t('currency.swap.ariaLabel')}>
                                <Icon name="switch-horizontal" className="w-6 h-6" />
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
                                1 {formData.fromCurrency} ≈ <span className="text-accent-blue dark:text-accent-purple">{(exchangeRate ?? 0).toFixed(4)}</span> {formData.toCurrency}
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
                            <p className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1.5">{t('common.result')}</p>
                            <div className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-3 py-2 text-sm min-h-[42px] flex items-center">
                                <span role="status" aria-live="polite" className="text-xl font-bold text-accent-blue dark:text-accent-purple">{formatCurrencyDisplay(convertedAmount, formData.toCurrency)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="currency.history.title">
                    {isHistoryLoading ? (
                         <div className="flex justify-center items-center h-80"><Icon name="refresh" className="animate-spin h-8 w-8 text-primary" /></div>
                    ) : historicalData.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer>
                                <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.3)" />
                                    <XAxis dataKey="date" stroke="currentColor" />
                                    <YAxis stroke="currentColor" domain={['dataMin', 'dataMax']} tickFormatter={(tick) => tick.toFixed(3)} />
                                    <Tooltip formatter={(value: number) => [value.toFixed(4), t('currency.tooltip.rate', { from: formData.fromCurrency, to: formData.toCurrency })]} />
                                    <Line type="monotone" dataKey="rate" name={t('currency.chart.rate', { from: formData.fromCurrency, to: formData.toCurrency })} stroke="var(--color-accent-blue)" strokeWidth={2} dot={false} />
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