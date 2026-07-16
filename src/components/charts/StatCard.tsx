import type { CardIconProps, TrendInfo } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";
import { TrendBadge } from "./TrendBadge";

export type StatBreakdownItem = {
  label: string;
  color: string;
};

type Props = CardIconProps & {
  value: string;
  trend?: TrendInfo;
  description: string;
  breakdown?: StatBreakdownItem[];
};

export function StatCard({ icon, iconBg, iconColor, title, value, trend, description, breakdown }: Props) {
  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} className="justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[19px] font-bold text-[#1A1A1A]">{value}</span>
          {trend && <TrendBadge direction={trend.direction} label={trend.label} />}
        </div>
        {breakdown ? (
          <div className="grid grid-cols-2 gap-3">
            {breakdown.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold text-[#666]">{item.label}</span>
                <span className="h-4 w-full rounded-full" style={{ backgroundColor: item.color }} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] font-medium text-[#969696]">{description}</p>
        )}
      </div>
    </AnalyticsCard>
  );
}
