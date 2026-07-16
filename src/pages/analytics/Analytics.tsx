import { useState } from "react";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import type { FilterOption } from "@/components/filter/types";
import { AnalyticsTabs } from "./components/AnalyticsTabs";
import { OverviewTab } from "./components/OverviewTab";
import { UserBehaviorTab } from "./components/UserBehaviorTab";
import { GrowthRetentionTab } from "./components/GrowthRetentionTab";
import { ContentPerformanceTab } from "./components/ContentPerformanceTab";
import { CommunityPerformanceTab } from "./components/CommunityPerformanceTab";
import { MomentsInsightsTab } from "./components/MomentsInsightsTab";

type TabKey =
  | "overview"
  | "user-behavior"
  | "growth-retention"
  | "content-performance"
  | "community-performance"
  | "moments-insights";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "user-behavior", label: "User Behavior Analytics" },
  { key: "growth-retention", label: "Growth & Retention" },
  { key: "content-performance", label: "Content Performance" },
  { key: "community-performance", label: "Community Performance" },
  { key: "moments-insights", label: "Moments insights" },
];

const FILTER_OPTIONS: FilterOption[] = [
  {
    label: "Date range",
    value: "date-range",
    subOptions: [
      { label: "Last 7 days", value: "7d", isSelected: true },
      { label: "Last 30 days", value: "30d" },
      { label: "Last 90 days", value: "90d" },
    ],
  },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="space-y-0">
      <div className="flex items-start justify-between gap-6 p-6">
        <div>
          <h1 className="text-[19px] font-semibold text-[#0A0D14]">Analytics</h1>
          <p className="text-[13px] font-medium text-[#666]">
            Monitor platform performance, user behavior, and community activity in real time.
          </p>
        </div>
        <FilterDropdown options={FILTER_OPTIONS} />
      </div>

      <AnalyticsTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="p-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "user-behavior" && <UserBehaviorTab />}
        {activeTab === "growth-retention" && <GrowthRetentionTab />}
        {activeTab === "content-performance" && <ContentPerformanceTab />}
        {activeTab === "community-performance" && <CommunityPerformanceTab />}
        {activeTab === "moments-insights" && <MomentsInsightsTab />}
      </div>
    </div>
  );
}
