"use client";

import { useState, useEffect } from "react";
import Header from "@/components/LandingPage/Header";
import HeroSection from "@/components/LandingPage/HeroSection";
import { Footer } from "@/components/LandingPage/Footer";
import TestimonialsSection from "@/components/LandingPage/TestimonialsSection";
import ImpactSection from "@/components/LandingPage/ImpactSection";
import ProgramsSection from "@/components/LandingPage/ProgramsSection";
import HistorySection from "@/components/LandingPage/HistorySection";
import EventsSection from "@/components/LandingPage/EventsSection";
import GallerySection from "@/components/LandingPage/GallerySection";
import FAQSection from "@/components/LandingPage/FAQSection";
import StayConnectedSection from "@/components/LandingPage/StayConnectedSection";
import CallToActionSection from "@/components/LandingPage/CallToActionSection";
import { FeaturesSection } from "@/components/LandingPage/FeaturesSection";
import ContactSection from "@/components/LandingPage/ContactSection";

export default function EnhancedSchoolLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div
      className={`flex flex-col min-h-screen w-full relative ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <Header
        isDarkMode={isDarkMode}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        toggleDarkMode={toggleDarkMode}
      />
      <HeroSection isDarkMode={isDarkMode} />
      <FeaturesSection isDarkMode={isDarkMode} />
      <ImpactSection isDarkMode={isDarkMode} />
      <ProgramsSection
        isDarkMode={isDarkMode}
      />
      <HistorySection isDarkMode={isDarkMode} />
      <TestimonialsSection isDarkMode={isDarkMode} />
      <EventsSection isDarkMode={isDarkMode} />
      <GallerySection isDarkMode={isDarkMode} />
      <FAQSection isDarkMode={isDarkMode} />
      <StayConnectedSection isDarkMode={isDarkMode} />
      <ContactSection/>
      <CallToActionSection isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
