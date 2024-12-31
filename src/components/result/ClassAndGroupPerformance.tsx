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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface ClassAndGroupPerformanceProps {
  classTrendData: Array<{ month: string } & Record<string, number | string>>;
  groupPerformanceData: Array<
    { group: string } & Record<string, number | string>
  >;
}

export function ClassAndGroupPerformance({
  classTrendData,
  groupPerformanceData,
}: ClassAndGroupPerformanceProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Class and Group Performance
        </CardTitle>
        <CardDescription>Comparison across classes and groups</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="classTrend" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="classTrend">Class Trend</TabsTrigger>
            <TabsTrigger value="groupComparison">Group Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="classTrend">
            <ChartContainer
              config={{
                class7: { label: "Class 7", color: "hsl(var(--chart-1))" },
                class8: { label: "Class 8", color: "hsl(var(--chart-2))" },
                class9: { label: "Class 9", color: "hsl(var(--chart-3))" },
                class10: { label: "Class 10", color: "hsl(var(--chart-4))" },
                class11: { label: "Class 11", color: "hsl(var(--chart-5))" },
                class12: { label: "Class 12", color: "hsl(var(--chart-6))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={classTrendData}>
                  <XAxis dataKey="month" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="class7"
                    stroke="var(--color-class7)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="class8"
                    stroke="var(--color-class8)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="class9"
                    stroke="var(--color-class9)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="class10"
                    stroke="var(--color-class10)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="class11"
                    stroke="var(--color-class11)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="class12"
                    stroke="var(--color-class12)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="groupComparison">
            <ChartContainer
              config={{
                class10: { label: "Class 10", color: "hsl(var(--chart-1))" },
                class11: { label: "Class 11", color: "hsl(var(--chart-2))" },
                class12: { label: "Class 12", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupPerformanceData}>
                  <XAxis dataKey="group" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="class10" fill="var(--color-class10)" />
                  <Bar dataKey="class11" fill="var(--color-class11)" />
                  <Bar dataKey="class12" fill="var(--color-class12)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
