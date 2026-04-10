"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface FrameSequenceProps {
  basePath: string; // Ex: /assets/hero-frames/desktop
  frameCount: number;
  fps: number;
  className?: string;
  poster?: string;
}

/**
 * FrameSequence Component
 * 
 * Instead of <video>, this component pre-loads a sequence of images
 * and renders them sequentially to a Canvas.
 * 
 * Benefits:
 * - No iOS native player issues (fullscreen, play pause overlay)
 * - True background play on all devices
 * - Better performance for auto-playing decorative content
 */
export function FrameSequence({ basePath, frameCount, fps, className, poster }: FrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);

  // Pre-load frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(4, "0");
      img.src = `${basePath}/frame-${frameNumber}.webp`;
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setIsLoaded(true);
        }
      };
      
      img.onerror = () => {
        console.error(`FrameSequence: Failed to load ${img.src}`);
        // Consider it loaded anyway to not block the whole sequence if one frame fails
        loadedCount++;
        if (loadedCount === frameCount) setIsLoaded(true);
      };
      
      images.push(img);
    }
    
    imagesRef.current = images;

    return () => {
      imagesRef.current = [];
    };
  }, [basePath, frameCount]);

  // Animation Loop
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameInterval = 1000 / fps;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastUpdateRef.current;

      if (elapsed > frameInterval) {
        lastUpdateRef.current = timestamp - (elapsed % frameInterval);
        
        const currentImg = imagesRef.current[currentFrameRef.current];
        if (currentImg && currentImg.complete) {
          // Adjust canvas size to image aspect ratio if needed
          if (canvas.width !== currentImg.naturalWidth) {
            canvas.width = currentImg.naturalWidth;
            canvas.height = currentImg.naturalHeight;
          }
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);
        }

        currentFrameRef.current = (currentFrameRef.current + 1) % frameCount;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, frameCount, fps]);

  return (
    <div className={`relative ${className}`}>
      {/* Poster shown while loading */}
      {!isLoaded && poster && (
        <img 
          src={poster} 
          alt="Video Poster" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
