import { Info } from "lucide-react";
import { useState } from "react";

export function InfoIcon({ title, description }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center justify-center rounded-full p-1 hover:bg-app-bg/50 transition"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <Info size={16} className="text-app-muted hover:text-app-text transition" />
      </button>
      
      {isHovering && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-lg bg-app-panel border border-app-border shadow-lg p-3 text-xs">
          <div className="font-semibold text-app-strong mb-1">{title}</div>
          <p className="text-app-muted leading-relaxed">{description}</p>
          <div className="absolute right-3 -top-1 w-2 h-2 bg-app-panel border-t border-l border-app-border transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}
