const HistorySection = ({
  isDarkMode,
  loading,
}: {
  isDarkMode: boolean;
  loading: boolean;
}) => {
  return (
    <section
      className={`w-full py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="px-4 md:px-6">
        <h2
          className={`text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {loading ? (
            <div className="skeleton-title w-3/4 h-8 bg-gray-400 mb-4 mx-auto"></div>
          ) : (
            "Our History"
          )}
        </h2>
        {loading ? (
          <div className="space-y-10">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <div className="flex-1 space-y-4">
                <div className="skeleton-title w-1/2 h-6 bg-gray-400 mb-2"></div>
                <div className="skeleton-description w-3/4 h-4 bg-gray-400 mb-4"></div>
                <div className="skeleton-description w-3/4 h-4 bg-gray-400"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <div className="flex-1 space-y-4">
                <div className="skeleton-title w-1/2 h-6 bg-gray-400 mb-2"></div>
                <div className="skeleton-description w-3/4 h-4 bg-gray-400 mb-4"></div>
                <div className="skeleton-description w-3/4 h-4 bg-gray-400"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
            <div className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                <svg
                  aria-hidden="true"
                  className="w-3 h-3 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                Foundation of Acme School{" "}
                <span className="bg-primary text-primary-foreground text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                  Latest
                </span>
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Founded on January 13, 2022
              </time>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Acme School was established with a vision to provide innovative
                and personalized education.
              </p>
            </div>
            <div className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
                <svg
                  aria-hidden="true"
                  className="w-3 h-3 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                First Graduating Class
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                June 15, 2023
              </time>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Our first cohort of students graduated, marking a significant
                milestone in our school&apos;s history.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorySection;
