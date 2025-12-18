import React from 'react';
import { Icon } from './icons';

interface ChartData {
  name: string;
  value: number;
}

interface DashboardChartProps {
  data: ChartData[];
  title: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  const chartHeight = 320;
  const chartPaddingBottom = 100; // Space for rotated labels
  const chartPaddingTop = 30; // Space for value labels on hover
  const barAreaHeight = chartHeight - chartPaddingBottom - chartPaddingTop;

  const barWidth = 40;
  const barMargin = 25;
  const svgWidth = (barWidth + barMargin) * data.length;
  
  const gridLines = 4;

  if (!data || data.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-primary">
            <Icon name="chart-bar" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-300">{title}</h3>
            <p className="text-sm text-neutral-500">Visualização de leads por ferramenta premium</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-80 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <Icon name="grid" className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mb-4" />
            <p className="font-semibold text-neutral-600 dark:text-neutral-400">Nenhum dado para exibir</p>
            <p className="text-sm text-neutral-500">Ainda não há leads para as ferramentas premium.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-primary">
            <Icon name="chart-bar" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-300">{title}</h3>
            <p className="text-sm text-neutral-500">Visualização de leads por ferramenta premium</p>
          </div>
        </div>
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <svg width={svgWidth} height={chartHeight} viewBox={`0 0 ${svgWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--color-primary-dark)" stopOpacity="0.9" />
            </linearGradient>
            <style>{`
                :root {
                    --color-primary: #ff0e00;
                    --color-primary-dark: #e00c00;
                }
            `}</style>
          </defs>
          <g>
            {/* Grid Lines */}
            {Array.from({ length: gridLines }).map((_, i) => (
                <line
                    key={i}
                    x1="0"
                    y1={chartHeight - chartPaddingBottom - ((i + 1) * (barAreaHeight / gridLines))}
                    x2={svgWidth}
                    y2={chartHeight - chartPaddingBottom - ((i + 1) * (barAreaHeight / gridLines))}
                    className="stroke-neutral-200 dark:stroke-neutral-800"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                />
            ))}
            
            {/* Bars and Labels */}
            {data.map((item, index) => {
              const barHeight = Math.max((item.value / maxValue) * barAreaHeight, 2); // min height of 2px
              const x = index * (barWidth + barMargin);
              const y = chartHeight - barHeight - chartPaddingBottom;

              return (
                <g key={item.name} className="group">
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    ry="4"
                    fill="url(#barGradient)"
                    className="transition-all duration-300 ease-in-out"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    className="fill-neutral-800 dark:fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -translate-y-1 group-hover:translate-y-0"
                  >
                    {item.value}
                  </text>
                  <g transform={`translate(${x + barWidth / 2}, ${chartHeight - chartPaddingBottom + 12})`}>
                    <text
                      transform="rotate(-45)"
                      textAnchor="end"
                      fontSize="12"
                      className="fill-neutral-500 group-hover:fill-neutral-900 dark:group-hover:fill-white transition-colors"
                    >
                      {item.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DashboardChart;