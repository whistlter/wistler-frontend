import { Share2 } from "lucide-react";
import { ThumbsUpIcon } from "@/components/icons/ThumbsUpIcon";
import { BubbleChatIcon } from "@/components/icons/BubbleChatIcon";
import type { CardIconProps } from "./types";
import { AnalyticsCard } from "./AnalyticsCard";

export type ContentPreviewItem = {
  id: string;
  category: string;
  title: string;
  likes: number;
  comments: number;
  communityName?: string;
};

type Props = CardIconProps & {
  items: ContentPreviewItem[];
  variant?: "square" | "wide";
};

// Approximate rendered height of one row (thumbnail/text/engagement rows + padding + border) for
// each variant, used to cap the list to a deliberate "1.5 items" peek instead of growing to fit
// every item or matching a sibling card's height.
const ITEM_HEIGHT: Record<"square" | "wide", number> = { square: 90, wide: 124 };
const VISIBLE_ITEMS: Record<"square" | "wide", number> = { square: 2.3, wide: 1.68 };
const ITEM_GAP = 8;

function EngagementRow({ item }: { item: ContentPreviewItem }) {
  return (
    <div className="flex items-center gap-4 text-[12px] font-medium text-[#666]">
      <span className="flex items-center gap-1">
        <ThumbsUpIcon size={14} color="#666666" />
        {item.likes} likes
      </span>
      <span className="flex items-center gap-1.5">
        <BubbleChatIcon size={14} color="#666666" />
        {item.comments} comments
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <Share2 size={14} />
        Share
      </span>
    </div>
  );
}

export function ContentPreviewList({ icon, iconBg, iconColor, title, items, variant = "square" }: Props) {
  const maxHeight = ITEM_HEIGHT[variant] * VISIBLE_ITEMS[variant] + ITEM_GAP;
  return (
    <AnalyticsCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title}>
      <div className="no-scrollbar flex flex-col gap-2 overflow-y-auto" style={{ maxHeight }}>
        {items.map((item) =>
          variant === "wide" ? (
            <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-[#EFEFF3] p-3">
              <div className="flex items-center gap-3">
                <img
                  src={`https://picsum.photos/seed/${item.id}/108/74`}
                  alt=""
                  className="h-[37px] w-[54px] shrink-0 rounded-lg object-cover"
                />
                <p className="line-clamp-2 text-[12px] font-medium text-[#1A1A1A]">{item.title}</p>
              </div>
              {item.communityName && (
                <span className="flex items-center gap-2 text-[12px] font-medium text-[#666]">
                  <img
                    src={`https://picsum.photos/seed/${item.communityName}/40/40`}
                    alt=""
                    className="h-5 w-5 shrink-0 rounded-full object-cover"
                  />
                  {item.communityName}
                </span>
              )}
              <EngagementRow item={item} />
            </div>
          ) : (
            <div key={item.id} className="flex flex-col gap-2 rounded-xl border border-[#EFEFF3] p-3">
              <div className="flex items-center gap-2">
                <img
                  src={`https://picsum.photos/seed/${item.id}/64/64`}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-lg object-cover"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-medium text-[#484848]">{item.category}</span>
                  <span className="text-[12px] font-medium text-[#1A1A1A]">{item.title}</span>
                </div>
                {item.communityName && (
                  <span className="ml-auto flex items-center gap-1 rounded-2xl border border-[#E9E9ED] px-2 py-1 text-[12px] font-medium text-[#666]">
                    <img
                      src={`https://picsum.photos/seed/${item.communityName}/40/40`}
                      alt=""
                      className="h-5 w-5 shrink-0 rounded-full object-cover"
                    />
                    {item.communityName}
                  </span>
                )}
              </div>
              <EngagementRow item={item} />
            </div>
          ),
        )}
      </div>
    </AnalyticsCard>
  );
}
