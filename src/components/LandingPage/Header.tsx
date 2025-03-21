import Link from "next/link";
import { Button } from "../ui/button";
import { Sun, Moon, ChevronUp, ChevronDown, GraduationCap } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  loading: boolean; // New prop to indicate loading state
}

const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  toggleDarkMode,
  isDarkMode,
  loading, // Use loading prop
}) => {
  const [role, setRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/session");
        setRole(response.data?.user?.role || null);
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      }
    };
    fetchData();
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-background/95"
      } px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-5 md:py-4`}
    >
      <div className="flex h-14 items-center justify-between">
        {loading ? ( // Conditional rendering for skeleton
          <div className="flex w-full items-center justify-between space-x-6">
            <div
              className={`skeleton-header ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <div className="h-6 w-24 rounded bg-gray-400"></div>{" "}
              {/* Skeleton for logo */}
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-6 w-20 rounded bg-gray-400"></div>{" "}
              {/* Skeleton for menu */}
              <div className="h-6 w-10 rounded bg-gray-400"></div>{" "}
              {/* Skeleton for dark mode button */}
              <div className="h-6 w-10 rounded bg-gray-400"></div>{" "}
              {/* Skeleton for mobile menu button */}
            </div>
          </div>
        ) : (
          <>
            <Link className="mr-6 flex items-center justify-center" href="#">
              <GraduationCap className="size-6 text-primary" />
              <span className="ml-2 text-xl font-bold">Acme School</span>
            </Link>
            <div className="flex items-center space-x-2">
              <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
                <Link
                  className="transition-colors hover:text-primary"
                  href="#programs"
                >
                  Programs
                </Link>
                <Link
                  className="transition-colors hover:text-primary"
                  href="#features"
                >
                  Features
                </Link>
                <Link
                  className="transition-colors hover:text-primary"
                  href="#testimonials"
                >
                  Testimonials
                </Link>
                <Link
                  className="transition-colors hover:text-primary"
                  href="#events"
                >
                  Events
                </Link>
                <Link
                  className="transition-colors hover:text-primary"
                  href="#gallery"
                >
                  Gallery
                </Link>
              </nav>
              {role ? (
                <Link href={`/${role}`}>
                  <Button className="hidden md:block">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="hidden md:block">Login</Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Dark Mode"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <Sun className="size-6" />
                ) : (
                  <Moon className="size-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <ChevronUp className="size-6" />
                ) : (
                  <ChevronDown className="size-6" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>
      {isMenuOpen && (
        <nav className="py-4 md:hidden">
          <Link
            className="block py-2 transition-colors hover:text-primary"
            href="#programs"
            onClick={handleMenuClick}
          >
            Programs
          </Link>
          <Link
            className="block py-2 transition-colors hover:text-primary"
            href="#features"
            onClick={handleMenuClick}
          >
            Features
          </Link>
          <Link
            className="block py-2 transition-colors hover:text-primary"
            href="#testimonials"
            onClick={handleMenuClick}
          >
            Testimonials
          </Link>
          <Link
            className="block py-2 transition-colors hover:text-primary"
            href="#events"
            onClick={handleMenuClick}
          >
            Events
          </Link>
          <Link
            className="block py-2 transition-colors hover:text-primary"
            href="#gallery"
            onClick={handleMenuClick}
          >
            Gallery
          </Link>
          {role ? (
            <Link href={`/${role}`} onClick={handleMenuClick}>
              <Button className="mt-4 w-full">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login" onClick={handleMenuClick}>
              <Button className="mt-4 w-full">Apply Now</Button>
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
