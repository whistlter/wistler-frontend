import type { CardIconProps, TrendInfo } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";
import { TrendBadge } from "./TrendBadge";

export type DonutSegment = {
  label: string;
  value: number;
  displayValue: string;
  color: string;
};

type Props = CardIconProps & {
  segments: DonutSegment[];
  centerValue: string;
  trend?: TrendInfo;
  footnote?: string;
  legendPosition?: "right" | "bottom" | "list";
  variant?: "ring" | "gauge";
  size?: number;
};

type ArcSpec = { startDeg: number; sweepDeg: number };

// Fixed illustrative arc geometry matching the Figma gauge exactly (extracted from the
// source file's raw arcData: a two-tone status ring, not a data-proportional progress arc).
// Angle convention: 0deg = 3 o'clock, increasing clockwise.
const GAUGE_ARCS: ArcSpec[] = [
  { startDeg: 149.82, sweepDeg: 95.24 }, // left arc (segments[0])
  { startDeg: 249.16, sweepDeg: 140.47 }, // upper-right arc (segments[1])
];
// Figma's gauge arc ellipses use arcData.innerRadius = 0.8, i.e. ring thickness = 20% of the
// outer radius (10% of the diameter), and the stroke touches the bounding box edge exactly
// (confirmed via the nodes' absoluteRenderBounds — no extra inset).
const GAUGE_STROKE_RATIO = 0.1;
// Fraction of the box height (from top) where the lowest drawn point of the arcs sits,
// read directly off the same absoluteRenderBounds — used to size the empty gap at the bottom.
const GAUGE_VISUAL_BOTTOM_FRACTION = 0.746;

// "Total interactions" ring: also a fixed illustrative arrangement, not proportional to the
// segment values (Likes alone sweeps 225deg despite being ~30% of the total) — extracted the
// same way from the source ellipses' raw arcData.
const RING_ARCS: ArcSpec[] = [
  { startDeg: 24.42, sweepDeg: 225.0 }, // segments[0]
  { startDeg: 251.98, sweepDeg: 59.57 }, // segments[1]
  { startDeg: 336.5, sweepDeg: 45.0 }, // segments[2]
  { startDeg: 313.43, sweepDeg: 20.77 }, // segments[3]
];
// arcData.innerRadius = 0.6543 on the ring ellipses -> thickness = (1 - 0.6543) / 2 of diameter.
const RING_STROKE_RATIO = 0.17285;

// A true SVG round linecap radius is always strokeWidth/2 (too large here — it visually
// distorts the ratio between short and long arcs). Figma's actual corners are a small fixed
// fillet, so each arc end is capped separately with a small rounded rect instead.
const ARC_CAP_RADIUS = 2;

function ArcRing({
  size,
  segments,
  arcs,
  strokeRatio,
}: {
  size: number;
  segments: DonutSegment[];
  arcs: ArcSpec[];
  strokeRatio: number;
}) {
  const strokeWidth = size * strokeRatio;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.slice(0, arcs.length).map((segment, i) => {
        const arc = arcs[i];
        const dash = (arc.sweepDeg / 360) * circumference;
        const endDeg = arc.startDeg + arc.sweepDeg;
        // Cap each end at its true angle (not straddled or inset), so it never bleeds into the
        // gap or overlaps a neighbor's cap. Each rect's rounded edge sits exactly on the true
        // boundary and extends a small margin inward for overlap with the arc body — clamped to
        // half the segment's own arc length so short segments' two caps can't overshoot each
        // other and balloon into a diamond.
        const capExtent = Math.min(ARC_CAP_RADIUS * 3, dash / 2);
        const caps = [
          { deg: arc.startDeg, x: 0 },
          { deg: endDeg, x: -capExtent },
        ];
        return (
          <g key={segment.label}>
            <g transform={`rotate(${arc.startDeg} ${center} ${center})`}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeLinecap="butt"
              />
            </g>
            {caps.map(({ deg, x }) => {
              const rad = (deg * Math.PI) / 180;
              const px = center + radius * Math.cos(rad);
              const py = center + radius * Math.sin(rad);
              return (
                <rect
                  key={deg}
                  x={x}
                  y={-strokeWidth / 2}
                  width={capExtent}
                  height={strokeWidth}
                  rx={ARC_CAP_RADIUS}
                  fill={segment.color}
                  transform={`translate(${px} ${py}) rotate(${deg + 90})`}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChartCard({
  icon,
  iconBg,
  iconColor,
  title,
  segments,
  centerValue,
  trend,
  footnote,
  legendPosition,
  variant = "ring",
  size,
}: Props) {
  const resolvedLegendPosition = legendPosition ?? (variant === "gauge" ? "bottom" : "list");
  const resolvedSize = size ?? (variant === "gauge" ? 200 : 128);
  const arcs = variant === "gauge" ? GAUGE_ARCS : RING_ARCS;
  const strokeRatio = variant === "gauge" ? GAUGE_STROKE_RATIO : RING_STROKE_RATIO;

  // The gauge's arc gap sits at the bottom, so its square bounding box reserves
  // empty space below the visible strokes. Pull the legend up to close that gap
  // instead of guessing a fixed margin — derived from the same geometry as GAUGE_ARCS.
  let gaugePullUp = 0;
  if (variant === "gauge") {
    const emptySpaceBelow = resolvedSize * (1 - GAUGE_VISUAL_BOTTOM_FRACTION);
    const targetGap = 10;
    gaugePullUp = Math.max(0, emptySpaceBelow - targetGap);
  }

  const legend =
    resolvedLegendPosition === "right" ? (
      <div className="flex flex-col gap-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-[#878787]">
              <span className="h-1.5 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
            <span className="text-[#030303]">{segment.displayValue}</span>
          </div>
        ))}
      </div>
    ) : resolvedLegendPosition === "list" ? (
      <div className="flex w-full flex-col gap-1">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-4 text-[13px] font-medium">
            <span className="flex items-center gap-2 text-[#666]">
              <span className="h-3.5 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
            <span className="text-[#0A0D14]">{segment.displayValue}</span>
          </div>
        ))}
      </div>
    ) : (
      <div
        className="grid gap-x-8 gap-y-1.5 text-[11px] font-medium"
        style={{ gridAutoFlow: "column", gridTemplateRows: `repeat(${segments.length}, auto)` }}
      >
        {segments.map((segment) => (
          <span key={`${segment.label}-label`} className="flex items-center gap-1.5 text-[#878787]">
            <span className="h-1.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
            {segment.label}
          </span>
        ))}
        {segments.map((segment) => (
          <span key={`${segment.label}-value`} className="text-[#030303]">
            {segment.displayValue}
          </span>
        ))}
      </div>
    );

  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} footnote={footnote}>
      <div
        className={
          resolvedLegendPosition === "right"
            ? "flex items-center gap-6"
            : variant === "gauge"
              ? "flex flex-col items-center"
              : "flex flex-col items-center gap-5"
        }
      >
        <div
          className="relative shrink-0"
          style={{ width: resolvedSize, height: resolvedSize, marginBottom: variant === "gauge" ? -gaugePullUp : undefined }}
        >
          <ArcRing size={resolvedSize} segments={segments} arcs={arcs} strokeRatio={strokeRatio} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <span className="text-[16px] font-bold text-[#1A1A1A]">{centerValue}</span>
            {trend && <TrendBadge direction={trend.direction} label={trend.label} size="sm" />}
          </div>
        </div>
        {legend}
      </div>
    </AnalyticsCard>
  );
}
