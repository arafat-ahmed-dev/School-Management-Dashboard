import { Button } from "../ui/button";

const HeroSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <video autoPlay loop muted className="absolute w-auto min-w-full min-h-full max-w-none">
        <source src="/placeholder.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={`relative z-10 text-center ${isDarkMode ? 'text-white' : 'text-black'} px-4`}>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Acme School</h1>
        <p className="text-xl md:text-2xl mb-8">Empowering minds, shaping futures</p>
        <Button size="lg" className="mr-4">Schedule a Visit</Button>
        <Button variant="outline" size="lg">Learn More</Button>
      </div>
    </section>
  );
};

export default HeroSection;
