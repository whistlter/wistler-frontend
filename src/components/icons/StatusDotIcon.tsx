import type { FigmaIconProps } from "./types";

export function StatusDotIcon({ size = 15, color = "currentColor" }: FigmaIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.7497 7.50015C13.7497 10.9518 10.9515 13.75 7.4999 13.75C4.04822 13.75 1.25009 10.9518 1.25009 7.50015C1.25009 4.04848 4.04822 1.25034 7.4999 1.25034C10.9515 1.25034 13.7497 4.04848 13.7497 7.50015Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2.37 2.37"
      />
    </svg>
  );
}
