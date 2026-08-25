import { AppIcons } from "@/constants/constant";

type LoaderSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<LoaderSize, { outer: number; badge: number; logo: number; ring: number }> = {
    sm: { outer: 48, badge: 34, logo: 15, ring: 3 },
    md: { outer: 64, badge: 46, logo: 20, ring: 3 },
    lg: { outer: 88, badge: 64, logo: 28, ring: 4 },
};

export function Loader({
    text = "Loading...",
    fullScreen = false,
    size,
}: {
    text?: string;
    fullScreen?: boolean;
    size?: LoaderSize;
}) {
    const { outer, badge, logo, ring } = SIZE_MAP[size ?? (fullScreen ? "lg" : "md")];

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative flex items-center justify-center" style={{ width: outer, height: outer }}>
                {/* Spinning gradient ring, colors pulled from the app logo */}
                <div
                    className="absolute inset-0 animate-spin rounded-full"
                    style={{
                        background: "conic-gradient(from 0deg, #FD1C7A 0deg, #FF9A54 190deg, transparent 340deg)",
                        WebkitMaskImage: `radial-gradient(farthest-side, transparent calc(100% - ${ring}px), #000 calc(100% - ${ring}px))`,
                        maskImage: `radial-gradient(farthest-side, transparent calc(100% - ${ring}px), #000 calc(100% - ${ring}px))`,
                        animationDuration: "1s",
                    }}
                />

                {/* Logo badge */}
                <div
                    className="relative flex animate-pulse items-center justify-center rounded-full bg-[#1A1A1A] shadow-md"
                    style={{ width: badge, height: badge, animationDuration: "1.8s" }}
                >
                    <img src={AppIcons.logoW} alt="Whistler" style={{ width: logo }} />
                </div>
            </div>

            {text && <p className="text-sm font-medium text-[#666]">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return <div className="flex w-full items-center justify-center py-10">{content}</div>;
}
