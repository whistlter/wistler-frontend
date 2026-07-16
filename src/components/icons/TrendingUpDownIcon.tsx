import type { FigmaIconProps } from "./types";

export function TrendingUpDownIcon({ size = 15, color = "currentColor" }: FigmaIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.875 8.7507L4.37492 6.25078C4.92651 5.69917 5.2023 5.42338 5.54078 5.3929C5.59674 5.38785 5.65303 5.38785 5.70899 5.3929C6.04747 5.42338 6.32324 5.69917 6.87485 6.25078C7.42646 6.80232 7.7022 7.07813 8.04069 7.10862C8.09669 7.11369 8.15293 7.11369 8.20893 7.10862C8.54742 7.07813 8.82316 6.80232 9.37477 6.25078L12.4997 3.12586M9.99975 9.37568L12.4997 11.8756"
        stroke={color}
        strokeWidth="1.05466"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99966 12.3275C9.99966 12.3275 12.5627 12.7165 12.9517 12.3275C13.3407 11.9386 12.9517 9.37551 12.9517 9.37551"
        stroke={color}
        strokeWidth="1.05466"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99966 2.67251C9.99966 2.67251 12.5627 2.28357 12.9517 2.67253C13.3407 3.06149 12.9517 5.62456 12.9517 5.62456"
        stroke={color}
        strokeWidth="1.05466"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
