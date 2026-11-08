"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NavigationLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (!link || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (
        url.origin === window.location.origin &&
        (url.pathname !== window.location.pathname ||
          url.search !== window.location.search)
      ) {
        setIsNavigating(true);
      }
    };

    document.addEventListener("click", handleClick);
    const handlePopState = () => setIsNavigating(true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!isNavigating) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20">
      <div
        className="size-8 animate-spin rounded-full border-4 border-white/60 border-t-blue-500"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
};

export default NavigationLoader;
