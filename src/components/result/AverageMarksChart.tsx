"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface AverageMarksChartProps {
  data: Array<{ subject: string; current: number; previous: number }>;
  chartType: string;
  setChartType: (value: string) => void;
}

export function AverageMarksChart({
  data,
  chartType,
  setChartType,
}: AverageMarksChartProps) {
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            <XAxis dataKey="subject" stroke="#888888" />
            <YAxis stroke="#888888" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="current" fill="#82ca9d" />
            <Bar dataKey="previous" fill="#8884d8" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <XAxis dataKey="subject" stroke="#888888" />
            <YAxis stroke="#888888" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="current" stroke="#82ca9d" />
            <Line type="monotone" dataKey="previous" stroke="#8884d8" />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <XAxis dataKey="subject" stroke="#888888" />
            <YAxis stroke="#888888" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="current"
              fill="#82ca9d"
              stroke="#82ca9d"
            />
            <Area
              type="monotone"
              dataKey="previous"
              fill="#8884d8"
              stroke="#8884d8"
            />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold">
              Average Marks Comparison
            </CardTitle>
            <CardDescription>Current vs Previous Month</CardDescription>
          </div>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            current: {
              label: "Current Month",
              color: "hsl(var(--chart-1))",
            },
            previous: {
              label: "Previous Month",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
