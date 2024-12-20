import Image from "next/image"

const Navbar = () => {
  return (
    <div className="flex items-center justify-end md:justify-between w-full p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="search" width={14} height={14} />
        <input type="text" placeholder="Search.." className="w-[200px] p-2 bg-transparent outline-none"/>
      </div>
      {/* ICONS & USER */}
      <div className="flex items-center md:gap-6 gap-4">
        <div className="bg-white w-7 h-7 rounded-full flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="user" width={20} height={20} />
        </div>
        <div className="relative bg-white w-7 h-7 rounded-full flex items-center justify-center cursor-pointer">
          <Image src="/announcement.png" alt="user" width={20} height={20} />
          <span className="absolute -top-3 -right-3 rounded-full bg-purple-500 w-5 h-5 text-white flex justify-center items-center text-xs">2</span>
        </div>
        <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">Arafat Ahmed</span>
            <span className="text-right text-gray-500 text-[10px]">Admin</span>
        </div>
        <Image src="/avatar.png" alt="user" width={36} height={36} className="rounded-full" />
      </div>
    </div>
  );
}

export default Navbar