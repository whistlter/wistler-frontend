import type { CardIconProps } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";

export type RankingItem = {
  label: string;
  value: number;
  displayValue: string;
};

type Props = CardIconProps & {
  items: RankingItem[];
  footnote?: string;
  color?: string;
};

export function RankingListCard({ icon, iconBg, iconColor, title, items, footnote, color = "#2873FF" }: Props) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} footnote={footnote}>
      <div className="flex flex-col">
        {items.map((item, index) => {
          const percent = Math.max((item.value / maxValue) * 100, 10);
          const isTop = index === 0;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-[13px] font-medium text-[#0A0D14]">{item.label}</span>
              <div className="h-9 flex-1">
                <div
                  className="h-full rounded-lg"
                  style={{ width: `${percent}%`, backgroundColor: isTop ? color : "#EFEFEF" }}
                />
              </div>
              <span className="w-24 shrink-0 whitespace-nowrap text-right text-[13px] font-medium text-[#666]">
                {item.displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </AnalyticsCard>
  );
}
