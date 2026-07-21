import type { ReactNode } from "react";
import type { CardIconProps } from "./types";
import { IconBadge } from "./IconBadge";

type Props = CardIconProps & {
  children: ReactNode;
  footnote?: string;
  className?: string;
  headerAction?: ReactNode;
};

export function AnalyticsCard({
  icon,
  iconBg,
  iconColor,
  title,
  children,
  footnote,
  className = "",
  headerAction,
}: Props) {
  return (
    <div className={`flex flex-col rounded-2xl border border-[#EFEFF3] bg-white ${className}`}>
      <div className="flex items-center gap-2 border-b border-[#EFEFF3] p-4">
        <IconBadge icon={icon} bg={iconBg} color={iconColor} />
        <p className="text-[13px] font-medium text-[#666]">{title}</p>
        {headerAction && <div className="ml-auto">{headerAction}</div>}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        {footnote && (
          <span className="w-fit rounded-2xl bg-[#F7F7F7] px-2 py-1 text-[10px] font-medium text-[#878787]">
            {footnote}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
