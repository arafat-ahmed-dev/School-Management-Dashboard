import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const HeroSection = ({
  isDarkMode,
  loading,
}: {
  isDarkMode: boolean;
  loading: boolean;
}) => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {loading ? (
        <div
          className={`skeleton-hero ${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          {/* Skeleton for background */}
          <Skeleton className="w-full h-64 rounded-lg" />
          {/* Skeleton for text */}
          <div className="absolute z-10 text-center w-full">
            <Skeleton className="w-1/2 h-12 mx-auto mb-4" />
            <Skeleton className="w-1/3 h-8 mx-auto mb-6" />
            <div className="flex justify-center gap-4">
              <Skeleton className="w-32 h-12" />
              <Skeleton className="w-32 h-12" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <video
            autoPlay
            loop
            muted
            className="absolute w-auto min-w-full min-h-full max-w-none"
          >
            <source src="/HeroSection.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div
            className={`relative z-10 text-center ${
              isDarkMode ? "text-white" : "text-black"
            } px-4`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 shadow-sm">
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
        </>
      )}
    </section>
  );
};

export default HeroSection;
