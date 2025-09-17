import Image from "next/image"
import Link from "next/link";

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
        <Link href="/list/announcements">
          <div className="relative flex size-7 cursor-pointer items-center justify-center rounded-full bg-white">
            <Image src="/announcement.png" alt="user" width={20} height={20} />
            <span className="absolute -right-3 -top-3 flex size-5 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
              2
            </span>
          </div>
        </Link>
        <div className="flex flex-col">
          <span className="text-xs font-medium leading-3">Arafat Ahmed</span>
          <span className="text-right text-[10px] text-gray-500">Admin</span>
        </div>
        <Link href="/profile">
          <Image
            src="/avatar.png"
            alt="user"
            width={36}
            height={36}
            className="rounded-full"
          />
        </Link>
      </div>
    </div>
  );
}

export default Navbar