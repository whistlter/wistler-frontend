// src/features/moderation/ModerationPage.tsx
import { useState } from "react";
import { useModeration } from "./hook/useModerator";
import { FlaggedTab } from "./component/FlaggedTab";
import { ReviewTab } from "./component/ReviewTab";
import { OverviewTab } from "./component/overview";


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
                {(error as any)?.message ?? "Failed to load moderation data"}
            </div>
        );
    }

    /* ----------------------------
       LOADING STATE
    ---------------------------- */
    if (isLoading) {
        return (
            <div className="py-20 text-center text-[13px] text-[#969696]">
                Loading moderation data…
            </div>
        );
    }

    /* ----------------------------
       NO DATA STATE
    ---------------------------- */
    if (!stats) {
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-600">
                No moderation data available
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
                <OverviewTab stats={stats} activities={activities || []} />
            )}
            {activeTab === "flagged" && <FlaggedTab />}
            {activeTab === "review" && <ReviewTab />}
        </div>
    );
}