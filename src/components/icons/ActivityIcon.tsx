import type { FigmaIconProps } from "./types";

export function ActivityIcon({ size = 15, color = "currentColor" }: FigmaIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.69874 12.3004C1.875 11.4767 1.875 10.1509 1.875 7.49931C1.875 4.84774 1.875 3.52196 2.69874 2.69822C3.52247 1.87448 4.84826 1.87449 7.49983 1.87449C10.1514 1.87449 11.4772 1.87448 12.3009 2.69822C13.1247 3.52196 13.1247 4.84774 13.1247 7.49931C13.1247 10.1509 13.1247 11.4767 12.3009 12.3004C11.4772 13.1241 10.1514 13.1241 7.49983 13.1241C4.84826 13.1241 3.52247 13.1241 2.69874 12.3004Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.74987 7.50027H5.31232L6.56229 5.00034L8.43723 10.0002L9.68719 7.50027H11.2496"
        stroke={color}
        strokeWidth="1.05466"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
