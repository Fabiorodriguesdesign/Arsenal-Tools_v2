export interface CurrencyFormData {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
}

export interface LatestRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: { [key: string]: number };
}

export interface HistoricalRatesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: { [date: string]: { [currency: string]: number } };
}

export interface ChartDataPoint {
  date: string;
  rate: number;
}
