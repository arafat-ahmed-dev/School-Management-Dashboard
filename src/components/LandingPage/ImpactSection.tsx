import { useState, useEffect } from "react";

const ImpactSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
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

  return (
    <section
      className={`w-full py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
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
    </section>
  );
};

export default ImpactSection;
