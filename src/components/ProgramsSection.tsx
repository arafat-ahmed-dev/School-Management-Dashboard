"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const ProgramsSection: React.FC = () => {
  return (
    <section className="programs bg-gray-100 p-8">
      <h2 className="text-2xl">Our Programs</h2>
      <Tabs>
        <TabsList>
          <TabsTrigger value="science">Science</TabsTrigger>
          <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
          <TabsTrigger value="arts">Arts</TabsTrigger>
        </TabsList>
        <TabsContent value="science">
          <Card>
            <CardHeader>
              <CardTitle>Science Program</CardTitle>
              <CardDescription>Explore the world of science.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Details about the science program.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mathematics">
          <Card>
            <CardHeader>
              <CardTitle>Mathematics Program</CardTitle>
              <CardDescription>Delve into the world of mathematics.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Details about the mathematics program.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="arts">
          <Card>
            <CardHeader>
              <CardTitle>Arts Program</CardTitle>
              <CardDescription>Discover the world of arts.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Details about the arts program.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};
