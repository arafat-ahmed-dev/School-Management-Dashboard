"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PerformanceInsightsProps {
  insights: string[];
}

export function PerformanceInsights({ insights }: PerformanceInsightsProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
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
              <AlertTitle>Insight {index + 1}</AlertTitle>
              <AlertDescription>{insight}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
