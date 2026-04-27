"use client";

import { Play, Film } from "lucide-react";

interface LifestyleStoriesProps {
  videos?: string[];
}

export function LifestyleStories({ videos = [] }: LifestyleStoriesProps) {
  const stories = [
    {
      label: "Silent Unboxing",
      url: "/assets/videos/lifestyle/unboxing.mp4"
    },
    {
      label: "British Craftsmanship",
      url: "/assets/videos/lifestyle/craftsmanship.mp4"
    },
    {
      label: "Noir Aesthetic",
      url: "/assets/videos/lifestyle/lifestyle.mp4"
    }
  ];

  return (
    <div className="pt-12 pb-8 border-t border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
          Lifestyle Experience
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stories.map((story, idx) => (
          <div
            key={idx}
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-500 bg-black/40"
          >
            <video
              src={story.url}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              autoPlay
              muted
              loop
              playsInline
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3 pointer-events-none">
              <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500 text-center">
                <div className="p-1.5 mx-auto bg-white/10 backdrop-blur-md rounded-full mb-1 w-fit">
                  <Play size={10} className="fill-white text-white" />
                </div>
                <p className="text-[7px] font-black uppercase tracking-[0.1em] text-white/50 group-hover:text-accent">
                  {story.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
