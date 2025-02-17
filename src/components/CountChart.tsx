"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Total",
    count: 100,
    fill: "white",
  },
  {
    name: "Girls",
    count: 53,
    fill: "#FAE27C",
  },
  {
    name: "Boys",
    count: 60,
    fill: "#C3EBFA",
  },
];

const CountChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TTILE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Student</h1>
      </div>
      {/* CHART */}
      <div className="w-full h-[75%] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-aamSky rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h1 className="text-xs text-gray-300">Boys (55%)</h1>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-aamYellow rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h1 className="text-xs text-gray-300">Girls (45%)</h1>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
