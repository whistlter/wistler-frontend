import type { CSSProperties } from "react";

export function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
    return <div className={`animate-pulse rounded-md bg-[#EEEEEE] ${className}`} style={style} />;
}
