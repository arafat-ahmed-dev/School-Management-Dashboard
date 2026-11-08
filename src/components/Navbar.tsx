import Image from "next/image";
import NotificationComponent from "./NotificationComponent";
import UserInfo from "./UserInfo";
import { Suspense } from "react";

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-end p-4 md:justify-between">
      {/* SEARCH BAR */}
      <div className="hidden items-center gap-2 rounded-full px-2 text-xs ring-[1.5px] ring-gray-300 md:flex">
        <Image src="/search.png" alt="search" width={14} height={14} />
        <input
          type="text"
          placeholder="Search.."
          className="w-[200px] bg-transparent p-2 outline-none"
        />
      </div>
      {/* ICONS & USER */}
      <div className="flex items-center gap-4 md:gap-6">
        <NotificationComponent />
        <Suspense fallback={<div className="h-9 w-24 animate-pulse rounded-full bg-gray-200" />}>
          <UserInfo />
        </Suspense>
      </div>
    </div>
  );
};

export default Navbar;