
import React from 'react';
import StatCard from './StatCard';
import DashboardChart from './DashboardChart';
import { Icon } from './icons';
import { Tool, Lead } from '../types';

interface ChartData {
  name: string;
  value: number;
}

interface OverviewProps {
  tools: Tool[];
  leads: Lead[];
  leadsByToolData: ChartData[];
  dailyVisits?: number;
}

const Overview: React.FC<OverviewProps> = ({ tools, leads, leadsByToolData, dailyVisits = 0 }) => {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Visão Geral</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">Um resumo dos seus principais indicadores de desempenho.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <StatCard 
            icon={<Icon name="eye" className="w-6 h-6" />} 
            title="Acessos Hoje" 
            value={dailyVisits.toString()} 
        />
        <StatCard 
            icon={<Icon name="toolbox" className="w-6 h-6" />} 
            title="Total de Ferramentas" 
            value={tools.length.toString()} 
        />
        <StatCard 
            icon={<Icon name="lead" className="w-6 h-6" />} 
            title="Total de Leads" 
            value={leads.length.toString()} 
        />
      </div>
      
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
        <DashboardChart data={leadsByToolData} title="Interesse por Ferramenta" />
      </div>
    </section>
  );
};

export default Overview;
