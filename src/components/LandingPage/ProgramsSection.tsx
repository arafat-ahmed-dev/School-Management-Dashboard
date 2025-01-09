import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const ProgramsSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <section
      id="programs"
      className={`w-full py-12 md:py-24 lg:py-32 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Our Programs
        </h2>
        <Tabs defaultValue="elementary" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-fit ">
            <TabsTrigger value="elementary" className="relative">
              Elementary{" "}
              <span
                className="absolute right-2 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {" "}
                {isMenuOpen ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="middle" className={`md:block ${isMenuOpen ? "block" : "hidden"}`}>
              Middle School
            </TabsTrigger>
            <TabsTrigger value="high" className={`md:block ${isMenuOpen ? "block" : "hidden"}`}>
              High School
            </TabsTrigger>
          </TabsList>
          <TabsContent value="elementary">
            <Card>
              <CardHeader>
                <CardTitle>Elementary Education</CardTitle>
                <CardDescription>Grades K-5</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our elementary program focuses on building a strong foundation
                  in core subjects while fostering creativity and critical
                  thinking. We offer:
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
                  Our middle school program is designed to nurture curiosity and
                  develop critical thinking skills. We offer:
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
  );
};

export default ProgramsSection;
