import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import type { CardIconProps, TrendInfo } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";
import { TrendBadge } from "./TrendBadge";
import { ChartTooltip } from "./ChartTooltip";
import { useFollowTooltip } from "./useFollowTooltip";

export type BarDatum = {
  label: string;
  value: number;
  secondaryValue?: number;
};

function computeNiceTicks(maxValue: number, tickCount = 5): number[] {
  if (maxValue <= 0) return [0];
  const rawStep = maxValue / (tickCount - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;
  const niceStep = residual > 5 ? 10 * magnitude : residual > 2 ? 5 * magnitude : residual > 1 ? 2 * magnitude : magnitude;

  const ticks: number[] = [];
  let tick = 0;
  while (true) {
    ticks.push(Math.round(tick));
    if (tick >= maxValue) break;
    tick += niceStep;
  }
  return ticks.reverse();
}

type LegendItem = { label: string; color: string };

type Props = CardIconProps & {
  data: BarDatum[];
  activeLabel?: string;
  color?: string;
  secondaryColor?: string;
  inactiveColor?: string;
  legend?: LegendItem[];
  legendPosition?: "top" | "bottom";
  footnote?: string;
  footnotePosition?: "top" | "bottom";
  headerValue?: string;
  headerTrend?: TrendInfo;
  cornerStat?: { label: string; value: string; trend?: TrendInfo };
  height?: number;
};

export function BarChartCard({
  icon,
  iconBg,
  iconColor,
  title,
  data,
  activeLabel,
  color = "#2873FF",
  secondaryColor,
  inactiveColor = "#EFEFEF",
  legend,
  legendPosition = "bottom",
  footnote,
  footnotePosition = "bottom",
  headerValue,
  headerTrend,
  cornerStat,
  height = 180,
}: Props) {
  const stacked = data.some((d) => d.secondaryValue !== undefined);
  const maxDataValue = Math.max(...data.map((d) => d.value + (d.secondaryValue ?? 0)), 0);
  const resolvedTicks = computeNiceTicks(maxDataValue);
  const { containerRef, tooltip, handleMouseMove, handleMouseLeave } = useFollowTooltip();

  const footnoteEl = footnote && (
    <span className="w-fit rounded-2xl bg-[#F7F7F7] px-2 py-1 text-[10px] font-medium text-[#878787]">
      {footnote}
    </span>
  );

  const legendEl = legend && (
    <div className="flex flex-wrap items-center gap-3">
      {legend.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-[13px] font-medium text-[#0A0D14]">
          <span className="h-3.5 w-3.5 rounded" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );

  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title}>
      {footnotePosition === "top" && footnoteEl}
      {legendPosition === "top" && legendEl}
      <div className="relative">
        {cornerStat && (
          <div className="absolute right-0 top-0 z-10 flex flex-col items-end gap-1">
            <span className="text-[9px] font-medium text-[#878787]">{cornerStat.label}</span>
            <div className="flex items-center gap-1">
              <span className="text-[19px] font-bold text-[#080808]">{cornerStat.value}</span>
              {cornerStat.trend && <TrendBadge direction={cornerStat.trend.direction} label={cornerStat.trend.label} />}
            </div>
          </div>
        )}
        <div ref={containerRef} style={{ width: "100%", height }} onMouseLeave={handleMouseLeave}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 12, right: 4, left: 0, bottom: 0 }}
              barCategoryGap="30%"
              onMouseMove={handleMouseMove}
            >
              <CartesianGrid vertical={false} stroke="#E5E5E5" strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                interval={0}
                tick={{ fill: "#878787", fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: "#EFEFEF" }}
                tickLine={false}
              />
              <YAxis
                ticks={resolvedTicks}
                interval={0}
                domain={[resolvedTicks[resolvedTicks.length - 1], resolvedTicks[0]]}
                tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}k` : `${value}`)}
                tick={{ fill: "#878787", fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip cursor={false} content={() => null} />
              {stacked ? (
                <>
                  <Bar dataKey="value" stackId="a" fill={color} radius={[0, 0, 10, 10]} barSize={28} style={{ cursor: "pointer" }} />
                  <Bar
                    dataKey="secondaryValue"
                    stackId="a"
                    fill={secondaryColor ?? inactiveColor}
                    radius={[10, 10, 0, 0]}
                    barSize={28}
                    style={{ cursor: "pointer" }}
                  />
                </>
              ) : (
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={28} style={{ cursor: "pointer" }}>
                  {data.map((d) => (
                    <Cell key={d.label} fill={d.label === activeLabel ? color : inactiveColor} />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {tooltip &&
          data[tooltip.activeIndex] &&
          (() => {
            const datum = data[tooltip.activeIndex];
            const tooltipPayload = stacked
              ? [
                  { dataKey: "value", value: datum.value },
                  { dataKey: "secondaryValue", value: datum.secondaryValue },
                ]
              : [{ dataKey: "value", value: datum.value }];
            return (
              <div
                className="pointer-events-none absolute left-0 top-0 z-20 transition-transform duration-75 ease-out"
                style={{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }}
              >
                <ChartTooltip active label={datum.label} payload={tooltipPayload} />
              </div>
            );
          })()}
      </div>

      {legendPosition === "bottom" && legendEl}

      {footnotePosition === "bottom" && footnoteEl}

      {headerValue && (
        <div className="flex items-center gap-3">
          <span className="text-[19px] font-bold text-[#1A1A1A]">{headerValue}</span>
          {headerTrend && <TrendBadge direction={headerTrend.direction} label={headerTrend.label} />}
        </div>
      )}
    </AnalyticsCard>
  );
}
