import { cn } from "@/lib/utils";
import {
  Area,
  CartesianGrid,
  AreaChart as RechartAreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { BaseAxisProps } from "recharts/types/util/types";

interface AreaChartProps<T> {
  data: T[];
  xDataKey: keyof T;
  yDataKey: keyof T;
  height?: number;
  yAxisFormatter?: BaseAxisProps["tickFormatter"];
  xAxisTick?: BaseAxisProps["tick"];
  className?: string;
}

export const AreaChart = <T extends Record<string, string | number>>({
  data,
  xDataKey,
  yDataKey,
  height = 314,
  yAxisFormatter,
  xAxisTick,
  className,
}: AreaChartProps<T>) => {
  return (
    <div className={cn("mx-auto overflow-x-scroll", className)}>
      <ResponsiveContainer height={height} minHeight="314px">
        <RechartAreaChart
          data={data}
          margin={{ left: 0, top: 2 }}
          className="mx-auto"
        >
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="#000000" stopOpacity={0.05} />
              <stop offset="75%" stopColor="#000000" stopOpacity={0.03} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="10 10"
            stroke="#0000000f"
            strokeWidth={1}
          />
          <XAxis
            dataKey={xDataKey as string}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={xAxisTick}
            fontSize={12}
            fontWeight={500}
            width={44}
            letterSpacing={-0.12}
          />
          <YAxis
            dataKey={yDataKey as string}
            tickFormatter={yAxisFormatter}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            fontSize={12}
            fontWeight={500}
            width={44}
            letterSpacing={-0.12}
          />
          <Area
            type="monotone"
            dataKey={yDataKey as string}
            stroke="#000"
            fill="url(#color)"
            strokeWidth={2}
            dot={false}
          />
        </RechartAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
