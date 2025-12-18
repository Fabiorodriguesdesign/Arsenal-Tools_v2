
export type AssetType = 'acao' | 'fii' | 'crypto' | 'bdr';
export type OperationType = 'swing' | 'day';

export interface GainsResult {
  grossProfit: number;
  taxDue: number;
  netValue: number;
  isLoss: boolean;
}

export interface VariableIncomeFormData {
    saleValue: string;
    acquisitionCost: string;
    operationType: OperationType;
    assetType: AssetType;
}

export type FixedPeriodUnit = 'days' | 'months' | 'years';

export interface FixedIncomeFormData {
    grossProfit: string;
    investmentPeriod: string;
    investmentPeriodUnit: FixedPeriodUnit;
}

export interface FixedIncomeResult {
  appliedRate: number;
  taxDue: number;
  netProfit: number;
}
