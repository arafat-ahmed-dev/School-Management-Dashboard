"use client"
import { ITEM_PER_PAGE } from "@/lib/setting";
import { useRouter } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter()
  const changePage = (newPage : number)=> {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`${window.location.pathname}?${params}`);
  }

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === 1}
        onClick={() => changePage(page - 1)}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {/* <button className="px-2 rounded-sm bg-aamSky">1</button>
        <button className="px-2 rounded-sm ">2</button>
        <button className="px-2 rounded-sm ">3</button>
        ...
        <button className="px-2 rounded-sm ">10</button> */}
        {Array.from({ length: Math.floor(count / ITEM_PER_PAGE) }).map(
          (_, index) => {
            return (
              <button
                key={index}
                className={`px-2 rounded-sm ${
                  index + 1 === page ? "bg-aamSky" : "bg-gray-300"
                }`}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </button>
            );
          }
        )}
      </div>
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === Math.floor(count / ITEM_PER_PAGE)}
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
