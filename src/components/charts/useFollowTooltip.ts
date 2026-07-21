import { useRef, useState } from "react";

type TooltipPosition = {
  x: number;
  y: number;
  activeIndex: number;
};

type RechartsMouseState = {
  isTooltipActive?: boolean;
  activeIndex?: string | number | null;
};

export function useFollowTooltip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipPosition | null>(null);

  const handleMouseMove = (state: RechartsMouseState, event: React.MouseEvent) => {
    if (!state?.isTooltipActive || state.activeIndex == null || !containerRef.current) {
      setTooltip(null);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      activeIndex: Number(state.activeIndex),
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  return { containerRef, tooltip, handleMouseMove, handleMouseLeave };
}
