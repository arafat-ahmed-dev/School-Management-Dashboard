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
  return (
    <section
      className={`features ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} p-8`}
    >
      <h2 className={`text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 ${isDarkMode ? "text-white" : "text-black"}`}>
        Our Features
      </h2>
      {loading ? ( // Conditional rendering for skeleton
        <div className={`skeleton-features ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      ) : (
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
      )}
    </section>
  );
};
