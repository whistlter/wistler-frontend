import { Skeleton } from "./Skeleton";

export function DetailsPageSkeleton({ tabCount = 3 }: { tabCount?: number }) {
    return (
        <div className="flex w-full flex-col">
            {/* HEADER */}
            <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col items-start gap-2">
                        <Skeleton className="h-3.5 w-40" />
                        <Skeleton className="h-5 w-36" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex self-stretch border-b border-t border-[#E8E8E8] bg-white w-full">
                {Array.from({ length: tabCount }).map((_, i) => (
                    <div key={i} className="w-48 p-4">
                        <Skeleton className="h-3.5 w-20" />
                    </div>
                ))}
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3 rounded-xl border border-[#E8E8E8] bg-white">
                            <div className="flex items-center gap-2 border-b border-[#E8E8E8] p-4">
                                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="p-4">
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-[#E8E8E8] bg-white overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-[#EFEFF3] last:border-b-0">
                            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                            <Skeleton className="h-3.5 flex-1 max-w-[200px]" />
                            <Skeleton className="h-3.5 flex-1 max-w-[120px]" />
                            <Skeleton className="h-3.5 flex-1 max-w-[100px]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
