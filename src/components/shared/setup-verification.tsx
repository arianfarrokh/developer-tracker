"use client";

/**
 * Compile-time verification for shadcn setup.
 * Imports key components to ensure they resolve correctly.
 */
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

const chartData = [{ label: "Placeholder", value: 0 }];

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function SetupVerification() {
  return (
    <div className="hidden">
      <Calendar />
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart data={chartData}>
          <XAxis dataKey="label" hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
