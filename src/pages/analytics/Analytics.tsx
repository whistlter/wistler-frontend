import { useState } from "react";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import type { FilterOption } from "@/components/filter/types";
import { AppIcons } from "@/constants/constant";
import { useModal, DateRangeModal } from "@/components/modal";
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
  { label: "Date", value: "date", icon: AppIcons.calendar },
];

export default function AnalyticsPage() {
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterSelect = (option: FilterOption) => {
    if (option.value === "date") {
      openModal(
        ({ close }) => (
          <DateRangeModal
            close={close}
            onApply={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        ),
        { type: "center" },
      );
    }
  };

  return (
    <div className="space-y-0">
      <div className="flex items-start justify-between gap-6 p-6">
        <div>
          <h1 className="text-[19px] font-semibold text-[#0A0D14]">Analytics</h1>
          <p className="text-[13px] font-medium text-[#666]">
            Monitor platform performance, user behavior, and community activity in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(startDate || endDate) && (
            <div className="flex items-center gap-2 rounded-lg border border-[#FCE7F3] bg-[#FCE7F3] px-3 py-2">
              <span className="text-sm font-medium text-[#BE185D]">
                {startDate} - {endDate}
              </span>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="cursor-pointer text-[#BE185D] transition-colors hover:text-[#9F1239]"
              >
                <img src={AppIcons.x} alt="Clear" className="h-4 w-4 cursor-pointer" />
              </button>
            </div>
          )}
          <FilterDropdown options={FILTER_OPTIONS} onSelect={handleFilterSelect} />
        </div>
      </div>

      <AnalyticsTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="p-6">
        {activeTab === "overview" && <OverviewTab startDate={startDate} endDate={endDate} />}
        {activeTab === "user-behavior" && <UserBehaviorTab />}
        {activeTab === "growth-retention" && <GrowthRetentionTab startDate={startDate} endDate={endDate} />}
        {activeTab === "content-performance" && <ContentPerformanceTab startDate={startDate} endDate={endDate} />}
        {activeTab === "community-performance" && <CommunityPerformanceTab />}
        {activeTab === "moments-insights" && <MomentsInsightsTab startDate={startDate} endDate={endDate} />}
      </div>
    </div>
  );
}
