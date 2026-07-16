import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { CardIconProps, TrendInfo } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";
import { TrendBadge } from "./TrendBadge";
import { ChartTooltip } from "./ChartTooltip";
import { useFollowTooltip } from "./useFollowTooltip";

export type AreaDatum = {
  label: string;
  value: number;
};

type Props = CardIconProps & {
  data: AreaDatum[];
  activeLabel?: string;
  value: string;
  valueLabel?: string;
  valuePosition?: "top" | "bottom";
  trend?: TrendInfo;
  footnote?: string;
  color?: string;
  height?: number;
  curveType?: "monotone" | "linear";
  showDots?: boolean;
  showReferenceLine?: boolean;
};

export function TrendAreaChartCard({
  icon,
  iconBg,
  iconColor,
  title,
  data,
  activeLabel,
  value,
  valueLabel,
  valuePosition = "bottom",
  trend,
  footnote,
  color = "#5481D4",
  height = 150,
  curveType = "monotone",
  showDots = true,
  showReferenceLine = false,
}: Props) {
  const gradientId = `trend-area-${title.replace(/\s+/g, "-")}`;
  const { containerRef, tooltip, handleMouseMove, handleMouseLeave } = useFollowTooltip();

  const valueEl = (
    <div className="flex flex-col gap-1">
      {valueLabel && <span className="text-[13px] font-medium text-[#666]">{valueLabel}</span>}
      <div className="flex items-center gap-3">
        <span className="text-[19px] font-bold text-[#1A1A1A]">{value}</span>
        {trend && <TrendBadge direction={trend.direction} label={trend.label} />}
      </div>
    </div>
  );

  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} footnote={footnote}>
      {valuePosition === "top" && valueEl}
      <div className="relative">
        <div ref={containerRef} style={{ width: "100%", height }} onMouseLeave={handleMouseLeave}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 12, bottom: 0 }} onMouseMove={handleMouseMove}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={{ stroke: "#E9E9E9" }}
                tickLine={false}
                tick={({ x, y, payload }) => {
                  const isActive = payload.value === activeLabel;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      {isActive && <rect x={-16} y={4} width={32} height={16} rx={8} fill="#EEF3FB" />}
                      <text
                        x={0}
                        y={16}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={500}
                        fill={isActive ? "#2873FF" : "#878787"}
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
              />
              {showReferenceLine && activeLabel && (
                <ReferenceLine x={activeLabel} stroke="#5481D4" strokeDasharray="3 3" />
              )}
              <Tooltip cursor={false} content={() => null} />
              <Area
                type={curveType}
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={showDots ? { r: 3, fill: color, strokeWidth: 0, style: { cursor: "pointer" } } : false}
                activeDot={{ r: 4, style: { cursor: "pointer" } }}
                style={{ cursor: "pointer" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {tooltip && data[tooltip.activeIndex] && (
          <div
            className="pointer-events-none absolute left-0 top-0 z-20 transition-transform duration-75 ease-out"
            style={{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }}
          >
            <ChartTooltip
              active
              label={data[tooltip.activeIndex].label}
              payload={[{ dataKey: "value", value: data[tooltip.activeIndex].value }]}
            />
          </div>
        )}
      </div>

      {valuePosition === "bottom" && valueEl}
    </AnalyticsCard>
  );
}
