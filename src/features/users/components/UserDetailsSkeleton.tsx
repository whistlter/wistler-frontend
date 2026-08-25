import { Skeleton } from "@/components/common/Skeleton";

export function UserDetailsSkeleton() {
    return (
        <div className="flex w-full flex-col py-4">
            {/* HEADER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 pb-6 gap-6">
                <div className="pl-6">
                    <Skeleton className="h-3.5 w-40 mb-3" />
                    <Skeleton className="h-5 w-36" />
                </div>
                <div className="grid grid-cols-2 gap-6 self-center lg:flex lg:justify-end px-6">
                    <Skeleton className="h-10 w-full lg:w-40" />
                    <Skeleton className="h-10 w-full lg:w-32" />
                </div>
            </div>

            {/* PROFILE CARD */}
            <div className="w-full bg-white px-8 py-6 border border-[#EFEFF3]">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-6 w-20 rounded-[5px]" />
                        </div>
                        <Skeleton className="h-3.5 w-32" />
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-6">
                    <Skeleton className="h-3.5 w-48" />
                    <Skeleton className="h-3.5 w-56" />
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                    <Skeleton className="h-11 w-48 rounded-xl" />
                    <Skeleton className="h-11 w-40 rounded-xl" />
                </div>
            </div>

            {/* TABS */}
            <div className="flex self-stretch border-b border-[#E8E8E8] bg-white w-full">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="w-60 p-4">
                        <Skeleton className="h-3.5 w-20" />
                    </div>
                ))}
            </div>

            {/* TAB CONTENT (table placeholder) */}
            <div className="p-6">
                <div className="rounded-xl border border-[#E8E8E8] bg-white overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 px-4 py-4 border-b border-[#EFEFF3] last:border-b-0"
                        >
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
