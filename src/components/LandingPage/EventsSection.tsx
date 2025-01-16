import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Calendar, Bell, Trophy, Dice1 } from "lucide-react";
import { Button } from "../ui/button";

const EventsSection = ({
  isDarkMode,
  loading,
}: {
  isDarkMode: boolean;
  loading: boolean;
}) => {
  return (
    <section
      id="events"
      className={`w-full py-12 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
    >
      <div className="px-4 md:px-6">
        {loading ? (
          <div>
            <div className="skeleton-title w-3/4 h-8 bg-gray-400 mb-4 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`skeleton-card ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  } p-4 rounded-md`}
                >
                  <div className="h-8 bg-gray-400 rounded w-1/3 mb-4"></div>
                  <div className="h-6 bg-gray-400 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-400 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-400 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2
              className={`text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
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
                    Welcome back students! Let&apos;s start an exciting new
                    academic year.
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
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
