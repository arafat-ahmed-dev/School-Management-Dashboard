import prisma from "../../prisma";
import CountChart from "./CountChart";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
    where: {
      approved: "ACCEPTED",
    },
  });
  const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;
  return (
    <div className="size-full rounded-xl bg-white p-4">
      {/* TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Student</h1>
      </div>
      {/* CHART */}
      <CountChart boys={boys} girls={girls} />
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col items-center gap-1">
          <div className="size-5 rounded-full bg-aamSky" />
          <h1 className="font-bold">{boys}</h1>
          <h1 className="text-xs text-gray-300">
            Boys ({Math.round((boys / (boys + girls)) * 100)}%)
          </h1>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="size-5 rounded-full bg-aamYellow" />
          <h1 className="font-bold">{girls}</h1>
          <h1 className="text-xs text-gray-300">
            Girls ({Math.round((girls / (boys + girls)) * 100)}%)
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
