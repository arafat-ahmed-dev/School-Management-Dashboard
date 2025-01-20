"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import {
  toggleDarkMode,
  setDarkMode,
} from "@/lib/store/features/DarkMode/darkModeSlice";
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
import { MentorSection } from "@/components/LandingPage/MentorSection";

export default function EnhancedSchoolLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDarkMode = useSelector(
    (state: RootState) => state.darkMode.isDarkMode
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialTheme = () => {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return true;
      }
      return false;
    };

    dispatch(setDarkMode(getInitialTheme()));
  }, [dispatch]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const handleToggleDarkMode = () => dispatch(toggleDarkMode());

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
        toggleDarkMode={handleToggleDarkMode}
        loading={loading} // Pass loading prop to Header
      />
      <HeroSection isDarkMode={isDarkMode} loading={loading} />
      <FeaturesSection isDarkMode={isDarkMode} loading={loading} />
      <ImpactSection isDarkMode={isDarkMode} loading={loading} />
      <ProgramsSection isDarkMode={isDarkMode} loading={loading} />
      <HistorySection isDarkMode={isDarkMode} loading={loading} />
      <TestimonialsSection isDarkMode={isDarkMode} loading={loading} />
      <EventsSection isDarkMode={isDarkMode} loading={loading} />
      <GallerySection isDarkMode={isDarkMode} loading={loading} />
      <MentorSection isDarkMode={isDarkMode} />
      <FAQSection isDarkMode={isDarkMode} loading={loading} />
      <StayConnectedSection isDarkMode={isDarkMode} loading={loading} />
      <ContactSection isDarkMode={isDarkMode} loading={loading} />
      <CallToActionSection isDarkMode={isDarkMode} loading={loading} />
      <Footer isDarkMode={isDarkMode} loading={loading} />
    </div>
  );
}
