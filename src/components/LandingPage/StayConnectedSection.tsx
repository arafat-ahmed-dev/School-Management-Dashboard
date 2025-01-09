import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const StayConnectedSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
<section className={`w-full py-12 md:py-24 lg:py-32 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Stay Connected
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Subscribe to our newsletter for the latest updates and news from Acme School.
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
  );
};

export default StayConnectedSection;
