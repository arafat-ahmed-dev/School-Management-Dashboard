import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import Loading from "@/components/Loading";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      {/* LEFT: Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-[14%] bg-white p-2 md:w-[8%] lg:w-[16%] lg:p-4">
        <Link
          href={"/"}
          className="flex flex-1 items-center justify-center gap-2 lg:justify-start"
        >
          <Image src={"/logo.png"} alt={"Logo"} width={30} height={30} />
          <span className="hidden lg:block">Achme</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT: Content area with scroll */}
      <div className="ml-[14%] flex w-[86%] flex-col overflow-y-auto bg-[#F7F8FA] md:ml-[8%] md:w-[92%] lg:ml-[16%] lg:w-[84%] xl:w-[86%]">
        <Navbar />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
