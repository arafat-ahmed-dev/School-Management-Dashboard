import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "../ui/button";
import { Sun, Moon, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { role } from "@/lib/data"; // Updated import path

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
  const [user, setUser] = useState(true);
  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${isDarkMode ? "bg-gray-800" : "bg-background/95"} backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 md:px-5 py-2 md:py-4`}>
      <div className="flex h-14 items-center justify-between">
        {loading ? ( // Conditional rendering for skeleton
          <div className={`skeleton-header ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}>
            <div className="skeleton-logo"></div>
            <div className="skeleton-menu"></div>
          </div>
        ) : (
          <>
            <Link className="flex items-center justify-center mr-6" href="#">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold">Acme School</span>
            </Link>
            <div className="flex items-center space-x-2">
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link className="transition-colors hover:text-primary" href="#programs">Programs</Link>
                <Link className="transition-colors hover:text-primary" href="#features">Features</Link>
                <Link className="transition-colors hover:text-primary" href="#testimonials">Testimonials</Link>
                <Link className="transition-colors hover:text-primary" href="#events">Events</Link>
                <Link className="transition-colors hover:text-primary" href="#gallery">Gallery</Link>
              </nav>
              {user ? (
                <Link href={`/dashboard/${role}`}>
                  <Button className="hidden md:block">Dashboard</Button>
                </Link>
              ) : (
                <Button className="hidden md:block">Apply Now</Button>
              )}
              <Button variant="ghost" size="icon" aria-label="Toggle Dark Mode" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </Button>
            </div>
          </>
        )}
      </div>
      {isMenuOpen && (
        <nav className="py-4 md:hidden">
          <Link className="block py-2 transition-colors hover:text-primary" href="#programs" onClick={handleMenuClick}>Programs</Link>
          <Link className="block py-2 transition-colors hover:text-primary" href="#features" onClick={handleMenuClick}>Features</Link>
          <Link className="block py-2 transition-colors hover:text-primary" href="#testimonials" onClick={handleMenuClick}>Testimonials</Link>
          <Link className="block py-2 transition-colors hover:text-primary" href="#events" onClick={handleMenuClick}>Events</Link>
          <Link className="block py-2 transition-colors hover:text-primary" href="#gallery" onClick={handleMenuClick}>Gallery</Link>
          {user ? (
            <Link href={`/dashboard/${role}`} onClick={handleMenuClick}>
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
