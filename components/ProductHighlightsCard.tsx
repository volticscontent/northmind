import { ShieldCheck, Clock, UserCheck, Sparkles } from "lucide-react";

export function ProductHighlightsCard() {
  const highlights = [
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      text: "Premium Craftsmanship",
    },
    {
      icon: <Clock className="w-4 h-4" />,
      text: "Timeless British Aesthetic",
    },
    {
      icon: <UserCheck className="w-4 h-4" />,
      text: "Exceptional Fit & Comfort",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      text: "Versatile Styling",
    },
  ];

  return (
    <div className="bg-card/50 border border-white/5 p-6 space-y-4 mb-8">
      {highlights.map((item, index) => (
        <div key={index} className="flex items-center gap-4 group">
          <div className="text-accent group-hover:scale-110 transition-transform duration-300">
            {item.icon}
          </div>
          <span className="text-[11px] uppercase font-bold tracking-premium text-white/80 group-hover:text-white transition-colors duration-300">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}
