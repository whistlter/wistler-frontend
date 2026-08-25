import { Skeleton } from "@/components/common/Skeleton";

export function ModerationOverviewSkeleton() {
    return (
        <div className="flex flex-col gap-6 pt-6">
            {/* STATS GRID */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 px-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-xl border border-[#E8E8E8] bg-white">
                        <div className="flex items-center gap-2 border-b border-[#E8E8E8] w-full p-4">
                            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="p-4">
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>
                ))}
            </div>

            {/* RECENT ACTIVITY */}
            <div>
                <h2 className="mb-4 text-[14px] font-normal text-[#0A0D14] border-b border-t border-[#E8E8E8] w-full py-4 pl-6">
                    <div className="px-2">Recent Activity List</div>
                </h2>

                <div className="flex flex-col gap-4 px-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3 pb-4 border-b border-[#F5F5F5] last:border-b-0">
                            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                            <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                                <Skeleton className="h-3.5 w-1/3" />
                                <Skeleton className="h-3 w-2/3" />
                                <Skeleton className="h-2.5 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
