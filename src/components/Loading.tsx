"use client";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] p-2">
      <div className="flex w-full max-w-xs flex-col gap-3 rounded-lg bg-white p-4 shadow sm:max-w-sm sm:p-6 md:h-40 md:max-w-md md:gap-4 md:p-8">
        <div className="h-5 w-1/2 animate-pulse rounded bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 md:h-6" />
        <div className="h-3 w-full animate-pulse rounded bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 md:h-4" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 md:h-4" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 md:h-4" />
      </div>
    </div>
  );
};

export default Loading;
