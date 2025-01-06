import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, YAxis, XAxis } from "recharts";
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
      <CardContent>
        <Tabs defaultValue="classTrend" className="w-full">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="classTrend">Class Trend</TabsTrigger>
            <TabsTrigger value="groupComparison">Group Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="classTrend">
            {/* RadialBarChart */}
            <div className="w-full h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="100%"
                  barSize={32}
                  data={classTrendData}
                >
                  <RadialBar background dataKey="count" />
                </RadialBarChart>
              </ResponsiveContainer>
              <Image
                src="/maleFemale.png"
                alt="Male and Female chart icon"
                width={50}
                height={50}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </TabsContent>
          <TabsContent value="groupComparison">
            <ChartContainer
              config={{
                class9: { label: "Class 10", color: "hsl(var(--chart-1))" },
                class10: { label: "Class 10", color: "hsl(var(--chart-2))" },
                class11: { label: "Class 11", color: "hsl(var(--chart-3))" },
                class12: { label: "Class 12", color: "hsl(var(--chart-4))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupPerformanceData}>
                  <XAxis dataKey="group" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="class9" fill="var(--color-class9)" />
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
