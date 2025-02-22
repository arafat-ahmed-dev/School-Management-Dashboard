export function Footer({ isDarkMode, loading }: { isDarkMode: boolean; loading: boolean }) {
  return (
    <footer className={`py-6 ${loading ? "bg-gray-300" : isDarkMode ? "bg-gray-800" : "bg-gray-100"} text-center`}>
      <div className="container mx-auto">
        {loading ? (
          <div className={`skeleton-footer ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}>
            <div className="skeleton-text"></div>
          </div>
        ) : (
          <p className="font-semibold text-sm">&copy; {new Date().getFullYear()} Your School Name. All rights reserved.</p>
        )}
      </div>
    </footer>
  );
}
