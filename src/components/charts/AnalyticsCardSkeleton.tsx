import type { CardIconProps } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";
import { Skeleton } from "@/components/common/Skeleton";

type Variant = "stat" | "chart" | "donut" | "radial" | "funnel" | "list";

type Props = CardIconProps & {
  variant?: Variant;
  height?: number;
  footnote?: string;
};

function StatBody() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
  );
}

function ChartBody({ height }: { height: number }) {
  const bars = [55, 80, 40, 95, 65, 45, 75];
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {bars.map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-lg rounded-b-none" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function DonutBody() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Skeleton className="h-32 w-32 rounded-full" />
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

function RadialBody() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-8 w-20" />
      <div className="flex items-center justify-around gap-4">
        <Skeleton className="h-[190px] w-[190px] rounded-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

function FunnelBody() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-5 w-16" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-28 w-full rounded-xl" />
    </div>
  );
}

function ListBody() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl border border-[#EFEFF3] p-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsCardSkeleton({
  icon,
  iconBg,
  iconColor,
  title,
  footnote,
  variant = "stat",
  height = 180,
}: Props) {
  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} footnote={footnote}>
      {variant === "stat" && <StatBody />}
      {variant === "chart" && <ChartBody height={height} />}
      {variant === "donut" && <DonutBody />}
      {variant === "radial" && <RadialBody />}
      {variant === "funnel" && <FunnelBody />}
      {variant === "list" && <ListBody />}
    </AnalyticsCard>
  );
}
