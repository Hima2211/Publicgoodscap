import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface FundingChartProps {
  data: {
    amount: number;
    date: string;
  }[];
  gradientFrom: string;
  gradientTo: string;
}

export function FundingChart({ data: inputData, gradientFrom, gradientTo }: FundingChartProps) {
  const chartData = useMemo(() => {
    // Always generate 7 days of data points
    const points = 7;
    const total = inputData?.[0]?.amount || 1000;
    
    return Array.from({ length: points }, (_, i) => {
      if (i === points - 1) {
        // Last point is the current value
        return {
          amount: total,
          date: new Date().toISOString().split('T')[0]
        };
      }
      
      // Generate points with slight variance but trending upward
      const progress = 0.5 + ((i / (points - 1)) * 0.5); // Start at 50% of final value
      const variance = 0.95 + (Math.random() * 0.1); // ±5% variance
      return {
        amount: total * progress * variance,
        date: new Date(Date.now() - (points - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    });
  }, [inputData]);

  return (
    <div className="w-full h-[40px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          style={{ cursor: 'pointer' }}
        >
          <defs>
            <linearGradient id={`colorFunding-${gradientFrom}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={gradientFrom} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="amount"
            stroke={gradientFrom}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            fill={`url(#colorFunding-${gradientFrom})`}
            fillOpacity={1}
            isAnimationActive={false}
          />
          <XAxis dataKey="date" hide={true} />
          <YAxis 
            hide={true} 
            domain={['dataMin', 'dataMax']}
            padding={{ top: 5, bottom: 5 }}
          />
          <Tooltip
            cursor={{
              stroke: gradientFrom,
              strokeDasharray: '3 3',
              strokeWidth: 1,
              strokeOpacity: 0.5,
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-darkCard/90 backdrop-blur border border-darkBorder rounded px-2 py-1 text-[11px] shadow-md">
                    <div className="font-medium text-white">{formatCurrency(payload[0].value)}</div>
                  </div>
                );
              }
              return null;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
