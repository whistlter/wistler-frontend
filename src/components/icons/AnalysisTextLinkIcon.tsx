import type { FigmaIconProps } from "./types";

export function AnalysisTextLinkIcon({ size = 15, color = "currentColor" }: FigmaIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.1247 13.1241H6.24987C4.18754 13.1241 3.15637 13.1241 2.51569 12.4835C1.875 11.8427 1.875 10.8116 1.875 8.74928V1.87449"
        stroke={color}
        strokeWidth="1.05466"
        strokeLinecap="round"
      />
      <path d="M4.37466 2.49966H4.99964" stroke={color} strokeWidth="1.05466" strokeLinecap="round" />
      <path d="M4.37466 4.37517H6.87458" stroke={color} strokeWidth="1.05466" strokeLinecap="round" />
      <path
        d="M3.12483 12.4995C3.79414 11.2826 4.70152 8.13641 6.44116 8.13641C7.6435 8.13641 7.95487 9.66936 9.13314 9.66936C11.1603 9.66936 10.8665 6.24966 13.1245 6.24966"
        stroke={color}
        strokeWidth="1.05466"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
