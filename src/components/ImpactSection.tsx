"use client";

import React from "react";

interface ImpactSectionProps {
  counters: {
    students: number;
    teachers: number;
    courses: number;
  };
}

export const ImpactSection: React.FC<ImpactSectionProps> = ({ counters }) => {
  return (
    <section className="impact bg-white p-8">
      <h2 className="text-2xl">Our Impact</h2>
      <div className="mt-4">
        <p>Students: {counters.students}</p>
        <p>Teachers: {counters.teachers}</p>
        <p>Courses: {counters.courses}</p>
      </div>
    </section>
  );
};
