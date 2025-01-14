import { Skeleton } from "../ui/skeleton";

const ServicesSection = ({
  loading,
  isDarkMode,
}: {
  loading: boolean;
  isDarkMode: boolean;
}) => {
  return (
    <div
      className={`services-section ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      {loading ? (
        <Skeleton className="w-full h-64 rounded-lg" />
      ) : (
        <div className="services-content">
          <h2 className="text-3xl font-semibold">Our Services</h2>
          <p className="text-muted-foreground">
            We offer a wide range of wedding planning services.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesSection;
