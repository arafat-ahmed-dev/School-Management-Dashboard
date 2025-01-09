export function Footer({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <footer className="py-6 bg-gray-800 text-white text-center">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Your School Name. All rights reserved.</p>
      </div>
    </footer>
  );
}
