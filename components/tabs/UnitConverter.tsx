
import React, { useState } from 'react';
import Card from '../shared/Card';
import Input from '../shared/Input';
import Button from '../shared/Button';
import useMediaQuery from '../../hooks/useMediaQuery';
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
        <Card className="md:col-span-1" title={isMobile ? "unit.step1.title" : "common.configuration"}>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <label htmlFor="useBaseSizeToggle" className="text-sm font-medium text-gray-600 dark:text-gray-300 select-none cursor-pointer">
                    {t('unit.useBase.label')}
                  </label>
                  <input
                    type="checkbox"
                    id="useBaseSizeToggle"
                    checked={useBaseSize}
                    onChange={() => setUseBaseSize(!useBaseSize)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                {useBaseSize && (
                  <div className="animate-fadeIn">
                     <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('unit.baseSize.label')}</label>
                    <div className="flex gap-2">
                        <Input aria-label={t('unit.baseSize.ariaLabel')} type="text" value={baseSize} onChange={e => setBaseSize(e.target.value)} />
                        <select value={baseUnit} onChange={e => setBaseUnit(e.target.value as BaseUnit)} className="p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none">
                            <option value="px">px</option>
                            <option value="pt">pt</option>
                            <option value="in">in</option>
                            <option value="cm">cm</option>
                            <option value="mm">mm</option>
                            <option value="m">m</option>
                        </select>
                    </div>
                  </div>
                )}
                
                <div>
                    <div className="grid grid-cols-2 gap-2">
                       <Input label="unit.width.label" type="text" value={valueW} onChange={e => setValueW(e.target.value)} />
                       <Input label="unit.height.label" type="text" value={valueH} onChange={e => setValueH(e.target.value)} />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('unit.unit.label')}</label>
                    <select value={unit} onChange={e => setUnit(e.target.value as Unit)} className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none">
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
                    </select>
                </div>
            </div>
            {isMobile && <Button onClick={() => setStep(2)} className="w-full mt-6">{t('unit.seeConversion')}</Button>}
        </Card>
    );
    
    const ResultsStep = (
        <div role="status" aria-live="polite">
             <Card className="md:col-span-2" title={isMobile ? "unit.step2.title" : "common.conversions"}>
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
