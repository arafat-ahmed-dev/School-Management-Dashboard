import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ClassData {
  [key: string]: {
    students: number;
    averageScore: number;
    groups?: string[];
  };
}

interface ClassLevelOverviewProps {
  classData: ClassData;
}

export function ClassLevelOverview({ classData }: ClassLevelOverviewProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Class-Level Overview
        </CardTitle>
        <CardDescription>Performance summary for each class</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="7" className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-full justify-start">
              {Object.keys(classData).map((classNum) => (
                <TabsTrigger key={classNum} value={classNum}>
                  Class {classNum}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          {Object.entries(classData).map(([classNum, data]) => (
            <TabsContent key={classNum} value={classNum}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{data.students}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{data.averageScore}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {data.groups ? (
                        data.groups.map((group) => (
                          <Badge key={group} variant="secondary">
                            {group}
                          </Badge>
                        ))
                      ) : (
                        <p>No groups for this class</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
