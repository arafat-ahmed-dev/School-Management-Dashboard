import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "../ui/button";

import { Sun, Moon, ChevronUp, ChevronDown } from "lucide-react";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, toggleDarkMode, isDarkMode }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 md:px-4 py-2 md:py-4">
      <div className="flex h-14 items-center justify-between">
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
          <Button className="hidden md:flex">Apply Now</Button>
          <Button variant="ghost" size="icon" aria-label="Toggle Dark Mode" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="py-4 md:hidden">
          <Link className="block py-2 transition-colors hover:text-primary" href="#programs">Programs</Link>
          <Link className="block py-2 transition-colors hover:text-primary" href="#features">Features</Link>
          <Link className="block py-2 transition-colors hover:text-primary" href="#testimonials">Testimonials</Link>
          <Link className="block py-2 transition-colors hover:text-primary" href="#events">Events</Link>
          <Link className="block py-2 transition-colors hover:text-primary" href="#gallery">Gallery</Link>
          <Button className="mt-4 w-full">Apply Now</Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
