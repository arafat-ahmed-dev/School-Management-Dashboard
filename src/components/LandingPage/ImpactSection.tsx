import { useState, useEffect } from "react";

const ImpactSection = ({
  isDarkMode,
  loading,
}: {
  isDarkMode: boolean;
  loading: boolean;
}) => {
  const [counters, setCounters] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
  });

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setCounters((prev) => ({
          students: prev.students < 1000 ? prev.students + 10 : 1000,
          teachers: prev.teachers < 100 ? prev.teachers + 1 : 100,
          courses: prev.courses < 50 ? prev.courses + 1 : 50,
        }));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <section
      className={`w-full py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      
        {loading ? ( // Conditional rendering for skeleton
        <>
         <div className="flex items-center justify-center mb-12">
      <div className="h-10 w-24 bg-gray-400 rounded"></div>
    </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="skeleton-impact">
              <div className="skeleton-counter w-20 h-20 rounded-full mx-auto"></div>
              <div className="mt-4 h-6 w-1/2 bg-gray-400 rounded mx-auto"></div>
            </div>
            <div className="skeleton-impact">
              <div className="skeleton-counter w-20 h-20 rounded-full mx-auto"></div>
              <div className="mt-4 h-6 w-1/2 bg-gray-400 rounded mx-auto"></div>
            </div>
            <div className="skeleton-impact">
              <div className="skeleton-counter w-20 h-20 rounded-full mx-auto"></div>
              <div className="mt-4 h-6 w-1/2 bg-gray-400 rounded mx-auto"></div>
            </div>
          </div>
          </>
        ) : (
          <div className="px-4 md:px-6">
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
        )}
    </section>
  );
};

export default ImpactSection;
