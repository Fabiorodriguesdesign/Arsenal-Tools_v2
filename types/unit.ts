
export type Unit = 'px' | 'pt' | 'in' | 'cm' | 'mm' | 'rem' | 'em' | '%';
export type BaseUnit = 'px' | 'pt' | 'in' | 'cm' | 'mm' | 'm';

export interface UnitConverterFormData {
    baseSize: string;
    baseUnit: BaseUnit;
    valueW: string;
    valueH: string;
    unit: Unit;
    useBaseSize: boolean;
}
