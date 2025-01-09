import { Button } from "../ui/button";

const CallToActionSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <section
      className={`w-full py-12 ${isDarkMode ? "bg-gray-800" : "bg-primary"}`}
    >
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Ready to Join Our Community?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
              Take the first step towards an exceptional education. Apply now or
              schedule a visit to learn more about Acme School.
            </p>
          </div>
          <div className="space-x-4">
            <Button variant="secondary" size="lg">
              Apply Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 dark:text-black"
            >
              Schedule a Visit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
