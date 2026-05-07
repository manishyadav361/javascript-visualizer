import { Info } from "lucide-react";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";

export function InfoIcon({ title, description }) {
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPos({
        x: rect.right - 256,
        y: rect.bottom + 8,
      });
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => setIsHovering(false);

  return (
    <>
      <button
        ref={buttonRef}
        className="flex items-center justify-center rounded-full p-1 hover:bg-app-bg/50 transition"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <Info size={16} className="text-app-muted hover:text-app-text transition" />
      </button>
      
      {isHovering && createPortal(
        <div
          className="fixed z-50 w-64 rounded-lg bg-app-panel border border-app-border shadow-xl p-3 text-xs pointer-events-none"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="font-semibold text-app-strong mb-1">{title}</div>
          <p className="text-app-muted leading-relaxed">{description}</p>
          <div className="absolute right-3 -top-1 w-2 h-2 bg-app-panel border-t border-l border-app-border transform rotate-45"></div>
        </div>,
        document.body
      )}
    </>
  );
}
