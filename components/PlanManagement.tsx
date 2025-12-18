
import React from 'react';
import { Icon } from './icons';

// FIX: This component is obsolete as monetization has shifted to a lead-capture model.
// It has been replaced with a placeholder to resolve compilation errors caused by
// removed types (Plan, NewPlan) and service methods.

const PlanManagement: React.FC = () => {
    return (
        <div className="text-center py-10 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
                <Icon name="warning" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Funcionalidade Desativada</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto">
                O gerenciamento de planos de assinatura foi descontinuado. A monetização agora é tratada através da captura de leads e da loja externa.
            </p>
        </div>
    );
};

export default PlanManagement;