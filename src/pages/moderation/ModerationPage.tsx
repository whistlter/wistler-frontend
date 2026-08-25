// src/features/moderation/ModerationPage.tsx
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useModeration } from "@/features/moderation/hooks/useModerator";
import { FlaggedTab } from "@/features/moderation/components/FlaggedTab";
import { ReviewTab } from "@/features/moderation/components/ReviewTab";
import { OverviewTab } from "@/features/moderation/components/overview";
import { ModerationOverviewSkeleton } from "@/features/moderation/components/ModerationOverviewSkeleton";
import { EmptyState } from "@/components/common/EmptyState";


type Tab = "overview" | "flagged" | "review";

export default function ModerationPage() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const { stats, activities, isLoading, isError, error } = useModeration();

    const tabs = [
        { key: "overview" as const, label: "Overview" },
        { key: "flagged" as const, label: "Flagged Content" },
        { key: "review" as const, label: "Review Queue" },
    ];

    /* ----------------------------
       ERROR STATE
    ---------------------------- */
    if (isError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                {(error as Error)?.message ?? "Failed to load moderation data"}
            </div>
        );
    }

    /* ----------------------------
       RENDER
    ---------------------------- */
    return (
        <div className="flex w-full flex-col ">
            {/* HEADER */}
            <div className="p-6">
                <h1 className="text-[19px] font-semibold text-[#0A0D14] leading-tight">
                    Moderation
                </h1>
                <p className="text-[13px] font-normal text-[#666] mt-1">
                    Manage flagged, reported, or problematic content across all communities
                </p>
            </div>

            {/* TABS */}
            <div className="flex  self-stretch  border-b border-t  border-[#E8E8E8] bg-white w-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative w-60 p-4 text-[13px] font-normal transition-colors cursor-pointer ${isActive ? "text-[#E31C5F]" : "text-[#666] hover:text-[#0A0D14]"
                                }`}
                        >
                            {tab.label}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E31C5F]" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT */}
            {activeTab === "overview" && (
                isLoading ? (
                    <ModerationOverviewSkeleton />
                ) : !stats ? (
                    <div className="p-6">
                        <EmptyState
                            icon={ShieldAlert}
                            title="No moderation data available"
                            description="Moderation stats and activity will appear here once available."
                        />
                    </div>
                ) : (
                    <OverviewTab stats={stats} activities={activities || []} />
                )
            )}
            {activeTab === "flagged" && <FlaggedTab />}
            {activeTab === "review" && <ReviewTab />}
        </div>
    );
}