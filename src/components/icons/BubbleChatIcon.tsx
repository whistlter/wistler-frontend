import type { FigmaIconProps } from "./types";

export function BubbleChatIcon({ size = 14, color = "currentColor" }: FigmaIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.00258 7H7.00783M9.33329 7H9.33854M4.67188 7H4.67711"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5413 7.0026C12.5413 10.0632 10.0602 12.5443 6.99967 12.5443C6.04995 12.5443 5.15599 12.3053 4.37467 11.8843C3.28487 11.2971 2.55154 11.843 1.90479 11.941C1.80669 11.9559 1.70898 11.9202 1.63882 11.8501C1.53233 11.7436 1.51206 11.5789 1.57088 11.4403C1.82472 10.842 2.05779 9.70822 1.74 8.7526C1.55706 8.20252 1.45801 7.61411 1.45801 7.0026C1.45801 3.94202 3.93909 1.46094 6.99967 1.46094C10.0602 1.46094 12.5413 3.94202 12.5413 7.0026Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
