import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Calendar, Bell, Trophy } from "lucide-react";
import { Button } from "../ui/button";

const EventsSection = ({ isDarkMode, loading }: { isDarkMode: boolean; loading: boolean }) => {
  return (
    <section
      id="events"
      className={`w-full py-12 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
    >
      <div className="px-4 md:px-6">
        <h2 className={`text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 ${isDarkMode ? "text-white" : "text-black"}`}>
          Upcoming Events
        </h2>
        {loading ? ( // Conditional rendering for skeleton
          <div className={`skeleton-events ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : (
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
                  Welcome back students! Let&apos;s start an exciting new academic
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
                <p>Showcase your innovative projects and compete for prizes.</p>
                <Button className="mt-4 w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
