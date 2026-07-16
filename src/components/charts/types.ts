import type { ComponentType } from "react";

export interface TrendInfo {
  direction: "up" | "down";
  label: string;
}

export type CardIcon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

export interface CardIconProps {
  icon: CardIcon;
  iconBg: string;
  iconColor: string;
  title: string;
}
