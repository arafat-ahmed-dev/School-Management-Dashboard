import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT: Fixed Sidebar */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] p-4 fixed top-0 left-0 h-full bg-white">
        <Link
          href={"/"}
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src={"/logo.png"} alt={"Logo"} width={30} height={30} />
          <span className="hidden lg:block">SchooLama</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT: Content area with scroll */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] ml-[14%] md:ml-[8%] lg:ml-[16%] overflow-y-auto flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
