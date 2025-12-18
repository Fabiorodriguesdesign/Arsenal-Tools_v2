
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useTranslation } from '../../hooks/useTranslation';
import { useUnitConverter } from '../../hooks/useUnitConverter';
import { BaseUnit, Unit } from '../../types/unit';

const UnitConverter: React.FC = () => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [step, setStep] = useState(1);

    const {
        formData,
        conversions,
        setBaseSize,
        setBaseUnit,
        setValueW,
        setValueH,
        setUnit,
        setUseBaseSize
    } = useUnitConverter();
    
    const { baseSize, baseUnit, valueW, valueH, unit, useBaseSize } = formData;

    const StepIndicator = () => (
        <div className="flex justify-center items-center mb-4">
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        </div>
    );

    const ConfigStep = (
        <Card className="md:col-span-1" title={isMobile ? t("unit.step1.title") : t("common.configuration")}>
            <div className="space-y-4">
                <div className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                  <Checkbox
                    id="useBaseSizeToggle"
                    checked={useBaseSize}
                    onChange={() => setUseBaseSize(!useBaseSize)}
                    label={t('unit.useBase.label')}
                  />
                </div>

                {useBaseSize && (
                  <div className="animate-fadeIn">
                    <div className="flex gap-2">
                        <Input label={t('unit.baseSize.label')} aria-label={t('unit.baseSize.ariaLabel')} type="text" value={baseSize} onChange={e => setBaseSize(e.target.value)} />
                        <div className="w-24 pt-6"> 
                            <Select 
                                value={baseUnit} 
                                onChange={e => setBaseUnit(e.target.value as BaseUnit)}
                            >
                                <option value="px">px</option>
                                <option value="pt">pt</option>
                                <option value="in">in</option>
                                <option value="cm">cm</option>
                                <option value="mm">mm</option>
                                <option value="m">m</option>
                            </Select>
                        </div>
                    </div>
                  </div>
                )}
                
                <div>
                    <div className="grid grid-cols-2 gap-2">
                       <Input label={t("unit.width.label")} type="text" value={valueW} onChange={e => setValueW(e.target.value)} />
                       <Input label={t("unit.height.label")} type="text" value={valueH} onChange={e => setValueH(e.target.value)} />
                    </div>
                </div>
                 <div>
                    <Select 
                        label={t('unit.unit.label')}
                        value={unit} 
                        onChange={e => setUnit(e.target.value as Unit)}
                    >
                        <option value="px">px</option>
                        <option value="pt">pt</option>
                        <option value="in">in</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                        {useBaseSize && (
                          <>
                            <option value="rem">rem</option>
                            <option value="em">em</option>
                            <option value="%">%</option>
                          </>
                        )}
                    </Select>
                </div>
            </div>
            {isMobile && <Button onClick={() => setStep(2)} className="w-full mt-6">{t('unit.seeConversion')}</Button>}
        </Card>
    );
    
    const ResultsStep = (
        <div role="status" aria-live="polite">
             <Card className="md:col-span-2" title={isMobile ? t("unit.step2.title") : t("common.conversions")}>
                <div className="overflow-x-auto">
                    <table className="min-w-full w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr>
                                <th className="p-2">{t('unit.table.unit')}</th>
                                <th className="p-2 text-right">{t('unit.table.width')}</th>
                                <th className="p-2 text-right">{t('unit.table.height')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <td colSpan={3} className="p-2 font-semibold text-sm text-gray-600 dark:text-gray-300">{t('unit.absolute.title')}</td>
                            </tr>
                            <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                <td className="p-2 font-medium">Pixels (px)</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.px.w}</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.px.h}</td>
                            </tr>
                            <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                <td className="p-2 font-medium">Points (pt)</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.pt.w}</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.pt.h}</td>
                            </tr>
                            <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                <td className="p-2 font-medium">Inches (in)</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.in.w}</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.in.h}</td>
                            </tr>
                            <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                <td className="p-2 font-medium">Centimeters (cm)</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.cm.w}</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.cm.h}</td>
                            </tr>
                             <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                <td className="p-2 font-medium">Millimeters (mm)</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.mm.w}</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.mm.h}</td>
                            </tr>
                            <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                <td className="p-2 font-medium">Meters (m)</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.m.w}</td>
                                 <td className="p-2 font-mono text-lg text-right">{conversions.m.h}</td>
                            </tr>
                            <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                <td className="p-2 font-medium">Kilometers (km)</td>
                                <td className="p-2 font-mono text-lg text-right">{conversions.km.w}</td>
                                 <td className="p-2 font-mono text-lg text-right">{conversions.km.h}</td>
                            </tr>
    
                            {useBaseSize && (
                              <>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <td colSpan={3} className="p-2 font-semibold text-sm text-gray-600 dark:text-gray-300">{t('unit.relative.title')}</td>
                                </tr>
                                <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                    <td className="p-2 font-medium">REM</td>
                                    <td className="p-2 font-mono text-lg text-right">{conversions.rem.w}</td>
                                    <td className="p-2 font-mono text-lg text-right">{conversions.rem.h}</td>
                                </tr>
                                <tr className="border-b dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                    <td className="p-2 font-medium">EM</td>
                                    <td className="p-2 font-mono text-lg text-right">{conversions.em.w}</td>
                                    <td className="p-2 font-mono text-lg text-right">{conversions.em.h}</td>
                                </tr>
                                <tr className="hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
                                    <td className="p-2 font-medium">Percentage (%)</td>
                                    <td className="p-2 font-mono text-lg text-right">{conversions['%'].w}</td>
                                    <td className="p-2 font-mono text-lg text-right">{conversions['%'].h}</td>
                                </tr>
                              </>
                            )}
                        </tbody>
                    </table>
                </div>
                 <p className="text-xs text-gray-400 mt-4 text-center">
                    {t('unit.footer.ppiNote')}
                    {useBaseSize && ` ${t('unit.footer.baseNote', { baseSize, baseUnit })}`}
                </p>
                 {isMobile && <Button onClick={() => setStep(1)} variant="secondary" className="w-full mt-6">{t('common.previous')}</Button>}
            </Card>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">{t('unit.title')}</h1>
             {isMobile ? (
                <div>
                    <StepIndicator />
                    {step === 1 && <div className="animate-fadeIn">{ConfigStep}</div>}
                    {step === 2 && <div className="animate-fadeIn">{ResultsStep}</div>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ConfigStep}
                    {ResultsStep}
                </div>
            )}
        </div>
    );
};

export default UnitConverter;
