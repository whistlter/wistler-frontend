import type { CardIconProps, TrendInfo } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";
import { TrendBadge } from "./TrendBadge";

export type FunnelStep = {
  label: string;
  value: string;
};

type Props = CardIconProps & {
  steps: FunnelStep[];
  value: string;
  trend?: TrendInfo;
  footnote?: string;
  colors?: string[];
};

const DEFAULT_COLORS = ["#AFC7F9", "#2E3A99", "#7EEFC3"];

function parseNumeric(value: string): number {
  return Number(value.replace(/[^0-9.]/g, "")) || 0;
}

export function FunnelCard({ icon, iconBg, iconColor, title, steps, value, trend, footnote, colors = DEFAULT_COLORS }: Props) {
  const numericValues = steps.map((step) => parseNumeric(step.value));
  const baseline = numericValues[0] || 1;
  const ratios = numericValues.map((v) => (v / baseline) * 100);

  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} footnote={footnote}>
      <div className="flex items-center gap-3">
        <span className="text-[19px] font-bold text-[#1A1A1A]">{value}</span>
        {trend && <TrendBadge direction={trend.direction} label={trend.label} />}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {steps.map((step) => (
          <div key={step.label} className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-[#878787]">{step.label}</span>
            <span className="text-[18px] font-semibold text-[#080808]">{step.value}</span>
            <span className="text-[10px] font-medium text-[#878787]">Users</span>
          </div>
        ))}
      </div>

      <div className="flex h-28 gap-1">
        {steps.map((_step, index) => {
          const topLeft = index === 0 ? ratios[0] : ratios[index - 1];
          const topRight = ratios[index];
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          return (
            <div
              key={_step.label}
              className={`h-full flex-1 overflow-hidden ${isFirst ? "rounded-l-xl" : ""} ${isLast ? "rounded-r-xl" : ""}`}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                <path
                  d={`M 0 ${100 - topLeft} Q 50 ${100 - (topLeft + topRight) / 2} 100 ${100 - topRight} L 100 100 L 0 100 Z`}
                  fill={colors[index % colors.length]}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </AnalyticsCard>
  );
}
