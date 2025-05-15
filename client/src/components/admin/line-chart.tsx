
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface LineChartProps {
  data: any[];
  xKey?: string;
  yKey?: string;
}

export function LineChart({ data, xKey = "date", yKey = "value" }: LineChartProps) {
  return (
    <ChartContainer 
      className="h-[300px]" 
      config={{
        line1: { theme: { light: "var(--chart-1)", dark: "var(--chart-1)" } },
      }}
    >
      <RechartsLineChart data={data}>
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          className="stroke-[--color-line1]" 
          strokeWidth={2} 
          dot={false}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
}
