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

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

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
        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            className={`px-2 rounded-sm ${
              pageNumber === page ? "bg-aamSky" : "bg-gray-300"
            } ${pageNumber === '...' ? 'cursor-default' : ''}`}
            onClick={() => typeof pageNumber === 'number' && changePage(pageNumber)}
            disabled={pageNumber === '...'}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === totalPages}
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
