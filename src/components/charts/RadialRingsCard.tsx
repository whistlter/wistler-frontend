import type { CardIconProps } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";

export type RadialRing = {
  label: string;
  value: number;
  proportion: number;
  color: string;
};

type Props = CardIconProps & {
  centerValue: string;
  rings: RadialRing[];
  footnote?: string;
};

const RADIUS = 76;
const STROKE_WIDTH = 22;
const SIZE = 190;
const CENTER = SIZE / 2;
const GAP_PX = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function pointOnCircle(angleDeg: number, radius: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

export function RadialRingsCard({ icon, iconBg, iconColor, title, centerValue, rings, footnote }: Props) {
  const startDegs = rings.map((_, i) => -90 + rings.slice(0, i).reduce((sum, r) => sum + (r.proportion / 100) * 360, 0));
  const segments = rings.map((ring, i) => {
    const sweepDeg = (ring.proportion / 100) * 360;
    const startDeg = startDegs[i];
    const dash = Math.max((ring.proportion / 100) * CIRCUMFERENCE - GAP_PX, 0);
    const midpoint = pointOnCircle(startDeg + sweepDeg / 2, RADIUS);
    return { ...ring, startDeg, dash, midpoint };
  });

  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} footnote={footnote}>
      <span className="text-[32px] font-bold text-[#080808]">{centerValue}</span>
      <div className="flex items-center justify-around gap-4">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="overflow-visible">
            {segments.map((segment) => (
              <g key={segment.label} transform={`rotate(${segment.startDeg} ${CENTER} ${CENTER})`}>
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={`${segment.dash} ${CIRCUMFERENCE - segment.dash}`}
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>
          {segments.map((segment) => (
            <span
              key={segment.label}
              className="pointer-events-none absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E0E0E0] bg-white text-[10px] font-semibold text-[#080808] shadow-sm"
              style={{ left: segment.midpoint.x, top: segment.midpoint.y }}
            >
              {segment.proportion}%
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {rings.map((ring) => (
            <div key={ring.label} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#878787]">
                <span className="h-1 w-3 rounded-full" style={{ backgroundColor: ring.color }} />
                {ring.label}
              </span>
              <span className="text-[18px] font-semibold text-[#080808]">{ring.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}
