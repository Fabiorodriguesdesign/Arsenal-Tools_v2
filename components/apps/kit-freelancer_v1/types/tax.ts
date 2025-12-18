
export type TaxRegime = 'simples-iii' | 'simples-v' | 'mei';

export interface TaxFormData {
  monthlyRevenue: string;
  serviceValue: string;
  taxRegime: TaxRegime;
  meiDasValue: string;
}

export interface ResultData {
    effectiveRate: number;
    monthlyTax: number;
    monthlyNet: number;
    serviceTax: number;
    serviceNet: number;
    warning: string | null;
}
