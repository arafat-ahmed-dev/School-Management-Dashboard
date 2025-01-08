import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  XAxis,
  CartesianGrid,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface ClassAndGroupPerformanceProps {
  classTrendData: Array<{ name: string } & Record<string, number | string>>;
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
      <CardContent className="p-0">
        <Tabs defaultValue="classTrend" className="w-full p-2">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="classTrend">Class Trend</TabsTrigger>
            <TabsTrigger value="groupComparison">Group Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="classTrend">
            {/* RadialBarChart */}
            <div className="w-full h-full p-0">
              <ChartContainer
                config={{
                  class7: { label: "Class 7", color: "hsl(var(--chart-1))" },
                  class8: { label: "Class 8", color: "hsl(var(--chart-2))" },
                  class9: { label: "Class 9", color: "hsl(var(--chart-3))" },
                  class10: { label: "Class 10", color: "hsl(var(--chart-4))" },
                  class11: { label: "Class 11", color: "hsl(var(--chart-5))" },
                  class12: { label: "Class 12", color: "hsl(var(--chart-6))" },
                }}
                className="w-full h-[350px] md:-left-3 -left-5 relative"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    barSize={50}
                    width={800}
                    height={400}
                    data={classTrendData}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="class7" stackId="a" fill="#C3EBFA" />
                    <Bar dataKey="class8" stackId="a" fill="#FAE27C" />
                    <Bar dataKey="class9" stackId="a" fill="#8884d8" />
                    <Bar dataKey="class10" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="class11" stackId="a" fill="#8884d8" />
                    <Bar dataKey="class12" stackId="a" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="groupComparison">
            <ChartContainer
              config={{
                class9: { label: "Class 9", color: "hsl(var(--chart-1))" },
                class10: { label: "Class 10", color: "hsl(var(--chart-2))" },
                class11: { label: "Class 11", color: "hsl(var(--chart-3))" },
                class12: { label: "Class 12", color: "hsl(var(--chart-4))" },
              }}
              className="h-[300px] w-full md:-left-4 -left-5 relative"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  barSize={window.innerWidth < 600 ? 9 : 12}
                  width={800}
                  height={400}
                  data={groupPerformanceData}
                >
                  <XAxis dataKey="group"  stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="class9"
                    fill="var(--color-class9)"
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="class10"
                    fill="var(--color-class10)"
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="class11"
                    fill="var(--color-class11)"
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="class12"
                    fill="var(--color-class12)"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
