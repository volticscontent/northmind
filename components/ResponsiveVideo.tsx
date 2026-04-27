"use client";

import { useEffect, useRef, useState } from "react";

interface ResponsiveVideoProps {
  desktopSrc: string;
  mobileSrc: string;
  poster?: string;
  className?: string;
}

/**
 * Serves different video sources based on screen width.
 * - Mobile (< 768px): lightweight compressed version (~1MB)
 * - Desktop (≥ 768px): full quality version
 * 
 * Also pauses video when not in viewport (IntersectionObserver)
 * to save battery on mobile devices.
 */
export function ResponsiveVideo({ desktopSrc, mobileSrc, poster, className }: ResponsiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");

  // Choose video source based on viewport width (runs once on mount)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setVideoSrc(isMobile ? mobileSrc : desktopSrc);
  }, [desktopSrc, mobileSrc]);

  // Pause video when out of viewport to save battery/performance
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {}); // Silently fail if autoplay blocked
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoSrc]);

  if (!videoSrc) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      preload="metadata"
      className={className}
      key={videoSrc} // Force re-mount when src changes
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
