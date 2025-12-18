
export type Unit = 'px' | 'pt' | 'in' | 'cm' | 'mm' | 'rem' | 'em' | '%';
export type BaseUnit = 'px' | 'pt' | 'in' | 'cm' | 'mm' | 'm';

const PX_PER_INCH = 96;
const CM_PER_INCH = 2.54;
const MM_PER_CM = 10;
const POINTS_PER_INCH = 72;

export const CONVERSION_TO_PX: Record<BaseUnit | 'px' | 'rem' | 'em' | '%' | string, number> = {
    px: 1,
    pt: PX_PER_INCH / POINTS_PER_INCH,
    in: PX_PER_INCH,
    cm: PX_PER_INCH / CM_PER_INCH,
    mm: (PX_PER_INCH / CM_PER_INCH) / MM_PER_CM,
    m: (PX_PER_INCH / CM_PER_INCH) * 100,
    km: (PX_PER_INCH / CM_PER_INCH) * 100 * 1000,
};

export const convertUnitToPx = (value: number, fromUnit: Unit | BaseUnit, baseSizePx: number): number => {
    switch (fromUnit) {
        case 'em':
        case 'rem':
            return value * baseSizePx;
        case '%':
            return (value / 100) * baseSizePx;
        case 'px':
        case 'pt':
        case 'in':
        case 'cm':
        case 'mm':
        case 'm':
            return value * (CONVERSION_TO_PX[fromUnit] || 1);
        default:
            return 0;
    }
};

export const calculateAllConversions = (valueInPx: number, baseSizePx: number) => {
    return {
        px: valueInPx.toFixed(3),
        pt: (valueInPx / CONVERSION_TO_PX.pt).toFixed(3),
        in: (valueInPx / CONVERSION_TO_PX.in).toFixed(3),
        cm: (valueInPx / CONVERSION_TO_PX.cm).toFixed(3),
        mm: (valueInPx / CONVERSION_TO_PX.mm).toFixed(3),
        m: (valueInPx / CONVERSION_TO_PX.m).toFixed(5),
        km: (valueInPx / CONVERSION_TO_PX.km).toFixed(8),
        rem: baseSizePx > 0 ? (valueInPx / baseSizePx).toFixed(3) : '0.000',
        em: baseSizePx > 0 ? (valueInPx / baseSizePx).toFixed(3) : '0.000',
        '%': baseSizePx > 0 ? ((valueInPx / baseSizePx) * 100).toFixed(3) : '0.000',
    };
};
