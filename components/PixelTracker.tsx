"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track on client side
    if (typeof window !== "undefined") {
      const fbq = (window as any).fbq;
      const ttq = (window as any).ttq;

      // Facebook Pixel PageView
      if (fbq) {
        fbq("track", "PageView");
      }

      // TikTok Pixel PageView
      if (ttq) {
        ttq.page();
      }
    }
  }, [pathname, searchParams]);

  return null;
}
