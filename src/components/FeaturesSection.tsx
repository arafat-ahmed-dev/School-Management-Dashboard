"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Trophy } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  return (
    <section className="features bg-gray-100 p-8">
      <h2 className="text-2xl">Our Features</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Experienced Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Our teachers are highly qualified and experienced.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>Modern Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We offer state-of-the-art facilities for our students.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle>Comprehensive Curriculum</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Our curriculum covers a wide range of subjects.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
