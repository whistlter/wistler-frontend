import type { TrendInfo } from "./types";

type Props = TrendInfo & {
  size?: "md" | "sm";
};

export function TrendBadge({ direction, label, size = "md" }: Props) {
  const isUp = direction === "up";
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-xl font-medium ${size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-[13px]"
        } ${isUp ? "bg-[#E4F7E9] text-[#0C8E03]" : "bg-[#F7E4E4] text-[#FF3932]"}`}
    >
      {isUp ? "↑" : "↓"} {label}
    </span>
  );
}
