"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export const HeroSection: React.FC = () => {
  return (
    <section className="hero bg-blue-500 text-white p-8">
      <h2 className="text-3xl">Welcome to Our School</h2>
      <p className="mt-4">Empowering students to achieve their full potential.</p>
      <Button className="mt-4">Learn More</Button>
    </section>
  );
};
