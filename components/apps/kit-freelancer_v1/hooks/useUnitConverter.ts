
import { useMemo, useEffect, useCallback } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { UnitConverterFormData, Unit, BaseUnit } from '../types/unit';
import { CONVERSION_TO_PX, convertUnitToPx, calculateAllConversions } from '../utils/unitConverter';

const INITIAL_STATE: UnitConverterFormData = {
    baseSize: '16',
    baseUnit: 'px',
    valueW: '1080',
    valueH: '1920',
    unit: 'px',
    useBaseSize: true
};

export const useUnitConverter = () => {
    const [formData, setFormData] = useFormPersistence<UnitConverterFormData>('unitConverterData', INITIAL_STATE);

    // Reset unit to px if base size usage is disabled and current unit is relative
    useEffect(() => {
      if (!formData.useBaseSize && ['rem', 'em', '%'].includes(formData.unit)) {
        setFormData(prev => ({ ...prev, unit: 'px' }));
      }
    }, [formData.useBaseSize, formData.unit, setFormData]);

    const conversions = useMemo(() => {
        const numBaseRaw = parseFloat(formData.baseSize.replace(',', '.')) || 16;
        const baseUnitKey = formData.baseUnit as keyof typeof CONVERSION_TO_PX;
        const numBaseInPx = numBaseRaw * (CONVERSION_TO_PX[baseUnitKey] || 1);
        
        const getConversions = (valStr: string) => {
            const numValue = parseFloat(valStr.replace(',', '.')) || 0;
            const valueInPx = convertUnitToPx(numValue, formData.unit, numBaseInPx);
            return calculateAllConversions(valueInPx, numBaseInPx);
        };

        const conversionsW = getConversions(formData.valueW);
        const conversionsH = getConversions(formData.valueH);
        
        return {
            px: { w: conversionsW.px, h: conversionsH.px },
            pt: { w: conversionsW.pt, h: conversionsH.pt },
            in: { w: conversionsW.in, h: conversionsH.in },
            cm: { w: conversionsW.cm, h: conversionsH.cm },
            mm: { w: conversionsW.mm, h: conversionsH.mm },
            m: { w: conversionsW.m, h: conversionsH.m },
            km: { w: conversionsW.km, h: conversionsH.km },
            rem: { w: conversionsW.rem, h: conversionsH.rem },
            em: { w: conversionsW.em, h: conversionsH.em },
            '%': { w: conversionsW['%'], h: conversionsH['%'] },
        };

    }, [formData]);

    // Actions
    const setBaseSize = useCallback((val: string) => setFormData(prev => ({ ...prev, baseSize: val })), [setFormData]);
    const setBaseUnit = useCallback((val: BaseUnit) => setFormData(prev => ({ ...prev, baseUnit: val })), [setFormData]);
    const setValueW = useCallback((val: string) => setFormData(prev => ({ ...prev, valueW: val })), [setFormData]);
    const setValueH = useCallback((val: string) => setFormData(prev => ({ ...prev, valueH: val })), [setFormData]);
    const setUnit = useCallback((val: Unit) => setFormData(prev => ({ ...prev, unit: val })), [setFormData]);
    const setUseBaseSize = useCallback((val: boolean) => setFormData(prev => ({ ...prev, useBaseSize: val })), [setFormData]);

    return {
        formData,
        conversions,
        setBaseSize,
        setBaseUnit,
        setValueW,
        setValueH,
        setUnit,
        setUseBaseSize
    };
};
