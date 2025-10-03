"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PerformanceInsightsProps {
  insights: string[];
}

export function PerformanceInsights({ insights }: PerformanceInsightsProps) {
  return (
    <Card className="mb-6 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold sm:text-xl">
          Performance Insights
        </CardTitle>
        <CardDescription>
          AI-generated analysis of student performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <Alert key={index}>
              <AlertDescription className="text-sm sm:text-base">{insight}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
