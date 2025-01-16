import Image from "next/image";

const UserCard = ({ type }: { type: string }) => {
  return (
    // <div className="rounded-2xl p-4 capitalize flex-1 min-w-[130px] animate-pulse">
    //   <div className="flex justify-between items-center h-4 bg-gray-200 rounded mb-4"></div>
    //   <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
    //   <div className="h-4 bg-gray-200 rounded w-full"></div>
    // </div>
    <div className="rounded-2xl odd:bg-aamPurple even:bg-aamYellow p-4 capitalize flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white py-1 px-2 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png " width={20} height={20} alt="more" />
      </div>
      <h1 className="text-2xl font-semibold my-4">1,234</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;
