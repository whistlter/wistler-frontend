import { Clock } from "lucide-react";
import type { CardIconProps } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";

type Props = CardIconProps & {
  footnote?: string;
  height?: number;
};

export function ComingSoonCard({ icon, iconBg, iconColor, title, footnote, height = 150 }: Props) {
  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} footnote={footnote}>
      <div className="flex flex-1 flex-col items-center justify-center gap-2" style={{ minHeight: height }}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F7] text-[#878787]">
          <Clock size={16} />
        </span>
        <span className="text-[13px] font-semibold text-[#1A1A1A]">Coming soon</span>
        <span className="text-[12px] font-medium text-[#969696]">This metric isn't available yet</span>
      </div>
    </AnalyticsCard>
  );
}
