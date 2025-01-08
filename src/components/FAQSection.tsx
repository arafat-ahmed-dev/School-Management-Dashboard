import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";

export function FAQSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What is the student-to-teacher ratio?
            </AccordionTrigger>
            <AccordionContent>
              Our average student-to-teacher ratio is 15:1, ensuring
              personalized attention for each student.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Do you offer financial aid?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer various financial aid options and scholarships based
              on merit and need. Please contact our admissions office for more
              information.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              What extracurricular activities are available?
            </AccordionTrigger>
            <AccordionContent>
              We offer a wide range of extracurricular activities including
              sports, arts, music, debate club, robotics, and community service
              opportunities.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
/* "use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  Bell,
  ChevronDown,
  ChevronUp,
  Star,
  Moon,
  Sun,
} from "lucide-react";

export default function EnhancedSchoolLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [counters, setCounters] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prev) => ({
        students: prev.students < 1000 ? prev.students + 10 : 1000,
        teachers: prev.teachers < 100 ? prev.teachers + 1 : 100,
        courses: prev.courses < 50 ? prev.courses + 1 : 50,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link className="flex items-center justify-center mr-6" href="#">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold">Acme School</span>
          </Link>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
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
            <Button className="hidden md:flex">Apply Now</Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Dark Mode"
              className="mr-6"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="container py-4 md:hidden">
            <Link
              className="block py-2 transition-colors hover:text-primary"
              href="#programs"
            >
              Programs
            </Link>
            <Link
              className="block py-2 transition-colors hover:text-primary"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="block py-2 transition-colors hover:text-primary"
              href="#testimonials"
            >
              Testimonials
            </Link>
            <Link
              className="block py-2 transition-colors hover:text-primary"
              href="#events"
            >
              Events
            </Link>
            <Link
              className="block py-2 transition-colors hover:text-primary"
              href="#gallery"
            >
              Gallery
            </Link>
            <Button className="mt-4 w-full">Apply Now</Button>
          </nav>
        )}
      </header>
      <main className="flex-1">
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="absolute w-auto min-w-full min-h-full max-w-none"
          >
            <source src="/placeholder.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Acme School
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Empowering minds, shaping futures
            </p>
            <Button size="lg" className="mr-4">
              Schedule a Visit
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Why Choose Acme School?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <Users className="w-8 h-8 mb-2" />
                  <CardTitle>Small Class Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Personalized attention and interactive learning
                    environments.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <BookOpen className="w-8 h-8 mb-2" />
                  <CardTitle>Innovative Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Cutting-edge programs designed to inspire and challenge
                    students.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <Trophy className="w-8 h-8 mb-2" />
                  <CardTitle>Extracurricular Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    A wide range of activities to develop well-rounded
                    individuals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Our Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">
                  {counters.students}+
                </p>
                <p className="text-xl">Students Enrolled</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">
                  {counters.teachers}+
                </p>
                <p className="text-xl">Expert Teachers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">
                  {counters.courses}+
                </p>
                <p className="text-xl">Courses Offered</p>
              </div>
            </div>
          </div>
        </section>

        <section id="programs" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Our Programs
            </h2>
            <Tabs defaultValue="elementary" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="elementary">Elementary</TabsTrigger>
                <TabsTrigger value="middle">Middle School</TabsTrigger>
                <TabsTrigger value="high">High School</TabsTrigger>
              </TabsList>
              <TabsContent value="elementary">
                <Card>
                  <CardHeader>
                    <CardTitle>Elementary Education</CardTitle>
                    <CardDescription>Grades K-5</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our elementary program focuses on building a strong
                      foundation in core subjects while fostering creativity and
                      critical thinking. We offer:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Personalized learning plans</li>
                      <li>STEM-focused curriculum</li>
                      <li>Arts and music programs</li>
                      <li>Physical education and outdoor activities</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="middle">
                <Card>
                  <CardHeader>
                    <CardTitle>Middle School</CardTitle>
                    <CardDescription>Grades 6-8</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our middle school program is designed to nurture curiosity
                      and develop critical thinking skills. We offer:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Advanced math and science courses</li>
                      <li>Language arts and social studies</li>
                      <li>Foreign language options</li>
                      <li>Technology and coding classes</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="high">
                <Card>
                  <CardHeader>
                    <CardTitle>High School</CardTitle>
                    <CardDescription>Grades 9-12</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our high school program prepares students for college and
                      beyond with rigorous academics and diverse extracurricular
                      opportunities. We offer:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Advanced Placement (AP) courses</li>
                      <li>College counseling and SAT/ACT prep</li>
                      <li>Internship and research opportunities</li>
                      <li>Competitive sports teams</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Our History
            </h2>
            <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
              <div className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                  <svg
                    aria-hidden="true"
                    className="w-3 h-3 text-primary-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Foundation of Acme School{" "}
                  <span className="bg-primary text-primary-foreground text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                    Latest
                  </span>
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  Founded on January 13, 2022
                </time>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  Acme School was established with a vision to provide
                  innovative and personalized education.
                </p>
              </div>
              <div className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                  <svg
                    aria-hidden="true"
                    className="w-3 h-3 text-primary-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  First Graduating Class
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  June 15, 2023
                </time>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Our first cohort of students graduated, marking a significant
                  milestone in our school's history.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              What Our Community Says
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Parent Testimonial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="italic">
                    "Acme School has been a transformative experience for my
                    child. The teachers are dedicated and the curriculum is
                    challenging yet engaging."
                  </p>
                  <p className="mt-2 font-semibold">- Sarah Johnson, Parent</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Student Testimonial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="italic">
                    "I love the diverse range of activities and the supportive
                    environment at Acme School. It's helped me discover my
                    passions and grow as a person."
                  </p>
                  <p className="mt-2 font-semibold">
                    - Michael Lee, 11th Grade Student
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="events"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Calendar className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>Open House</CardTitle>
                  <CardDescription>August 15, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Join us for a tour of our campus and meet our faculty.</p>
                  <Button className="mt-4 w-full">RSVP</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Bell className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>First Day of School</CardTitle>
                  <CardDescription>September 5, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Welcome back students! Let's start an exciting new academic
                    year.
                  </p>
                  <Button className="mt-4 w-full">Add to Calendar</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Trophy className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>Annual Science Fair</CardTitle>
                  <CardDescription>October 20, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Showcase your innovative projects and compete for prizes.
                  </p>
                  <Button className="mt-4 w-full">Learn More</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="gallery" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              School Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Image
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="School campus"
                className="rounded-lg object-cover"
              />
              <Image
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="Students in classroom"
                className="rounded-lg object-cover"
              />
              <Image
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="Science lab"
                className="rounded-lg object-cover"
              />
              <Image
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="Sports field"
                className="rounded-lg object-cover"
              />
              <Image
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="Library"
                className="rounded-lg object-cover"
              />
              <Image
                src="/placeholder.svg?height=300&width=400"
                width={400}
                height={300}
                alt="Art studio"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  What is the student-to-teacher ratio?
                </AccordionTrigger>
                <AccordionContent>
                  Our average student-to-teacher ratio is 15:1, ensuring
                  personalized attention for each student.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Do you offer financial aid?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer various financial aid options and scholarships
                  based on merit and need. Please contact our admissions office
                  for more information.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  What extracurricular activities are available?
                </AccordionTrigger>
                <AccordionContent>
                  We offer a wide range of extracurricular activities including
                  sports, arts, music, debate club, robotics, and community
                  service opportunities.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Stay Connected
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Subscribe to our newsletter for the latest updates and news
                  from Acme School.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    className="max-w-lg flex-1"
                  />
                  <Button type="submit">Subscribe</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Join Our Community?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Take the first step towards an exceptional education. Apply
                  now or schedule a visit to learn more about Acme School.
                </p>
              </div>
              <div className="space-x-4">
                <Button variant="secondary" size="lg">
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Schedule a Visit
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="#" className="flex items-center">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold">Acme School</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2023 Acme School. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              className="text-sm hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4"
              href="#"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

 */