"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, BookOpen, Trophy } from "lucide-react";

interface FeaturesSectionProps {
  isDarkMode: boolean;
  loading: boolean; // Add loading prop
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  isDarkMode,
  loading,
}) => {
  const SkeletonCard = () => (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md">
      <div className="flex items-center space-x-3">
        <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-400 rounded"></div>
      </div>
      <div className="mt-4">
        <div className="h-4 w-full bg-gray-400 rounded"></div>
        <div className="h-4 w-3/4 mt-2 bg-gray-400 rounded"></div>
      </div>
    </div>
  );
  const SkeletonHeader = () => (
    <div className="flex items-center justify-center mb-12">
      <div className="h-10 w-24 bg-gray-400 rounded"></div>
    </div>
  );
  return (
    <section
      className={`features ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} p-8`}
    >
      {loading ? (
        <div>
          <SkeletonHeader />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : (
        <div>
         <h2
        className={`text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        Our Features
      </h2>
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
      </div>
      )}
    </section>
  );
};
