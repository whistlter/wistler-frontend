import { StatusDotIcon } from "@/components/icons/StatusDotIcon";
import { AiContentGeneratorIcon } from "@/components/icons/AiContentGeneratorIcon";
import { MessageMultipleIcon } from "@/components/icons/MessageMultipleIcon";
import { StatCard } from "@/components/charts/StatCard";
import { ContentPreviewList } from "@/components/charts/ContentPreviewList";
import { ComingSoonCard } from "@/components/charts/ComingSoonCard";
import { AnalyticsCardSkeleton } from "@/components/charts/AnalyticsCardSkeleton";
import { useContentPerformanceAnalytics } from "@/features/analytics";

type Props = {
  startDate?: string;
  endDate?: string;
};

export function ContentPerformanceTab({ startDate, endDate }: Props) {
  const { data: rawData, isLoading } = useContentPerformanceAnalytics(startDate, endDate);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={AiContentGeneratorIcon} iconBg="#EAF0FF" iconColor="#2869FF" title="Posts created" variant="stat" />
          <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Average views per moment" variant="stat" />
          <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#EAF2FF" iconColor="#287AFF" title="Completion rate (Moments)" variant="stat" />
        </div>
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#FFEAF0" iconColor="#FF2869" title="Moments created" variant="stat" />
          <AnalyticsCardSkeleton icon={AiContentGeneratorIcon} iconBg="#FCEAFF" iconColor="#E228FF" title="Top performing posts" variant="list" />
        </div>
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={MessageMultipleIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="Post comments" variant="stat" />
          <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Top performing moments" variant="list" />
        </div>
      </div>
    );
  }

  const data = rawData ?? {};

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        {data.postsCreated ? (
          <StatCard
            icon={AiContentGeneratorIcon}
            iconBg="#EAF0FF"
            iconColor="#2869FF"
            title="Community Posts created"
            value={data.postsCreated.value}
            description={data.postsCreated.description}
          />
        ) : (
          <ComingSoonCard icon={AiContentGeneratorIcon} iconBg="#EAF0FF" iconColor="#2869FF" title="Posts created" height={60} />
        )}
        {data.averageViewsPerMoment ? (
          <StatCard
            icon={StatusDotIcon}
            iconBg="#F5EAFF"
            iconColor="#9B28FF"
            title="Average views per moment"
            value={data.averageViewsPerMoment.value}
            description={data.averageViewsPerMoment.description}
          />
        ) : (
          <ComingSoonCard
            icon={StatusDotIcon}
            iconBg="#F5EAFF"
            iconColor="#9B28FF"
            title="Average views per moment"
            height={60}
          />
        )}
        {data.completionRate ? (
          <StatCard
            icon={StatusDotIcon}
            iconBg="#EAF2FF"
            iconColor="#287AFF"
            title="Completion rate (Moments)"
            value={data.completionRate.value}
            description={data.completionRate.description}
          />
        ) : (
          <ComingSoonCard
            icon={StatusDotIcon}
            iconBg="#EAF2FF"
            iconColor="#287AFF"
            title="Completion rate (Moments)"
            height={60}
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {data.momentsCreated ? (
          <StatCard
            icon={StatusDotIcon}
            iconBg="#FFEAF0"
            iconColor="#FF2869"
            title="Moments created"
            value={data.momentsCreated.value}
            description={data.momentsCreated.description}
          />
        ) : (
          <ComingSoonCard icon={StatusDotIcon} iconBg="#FFEAF0" iconColor="#FF2869" title="Moments created" height={60} />
        )}
        {data.topPosts ? (
          <ContentPreviewList
            icon={AiContentGeneratorIcon}
            iconBg="#FCEAFF"
            iconColor="#E228FF"
            title="Top performing community posts"
            items={data.topPosts}
            variant="wide"
          />
        ) : (
          <ComingSoonCard icon={AiContentGeneratorIcon} iconBg="#FCEAFF" iconColor="#E228FF" title="Top performing posts" />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {data.commentsPerPost ? (
          <StatCard
            icon={MessageMultipleIcon}
            iconBg="#EAEDFF"
            iconColor="#2845FF"
            title="Community Post Comments"
            value={data.commentsPerPost.value}
            description={data.commentsPerPost.description}
          />
        ) : (
          <ComingSoonCard icon={MessageMultipleIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="Community Post Comments" height={60} />
        )}
        {data.topMoments ? (
          <ContentPreviewList
            icon={StatusDotIcon}
            iconBg="#F5EAFF"
            iconColor="#9B28FF"
            title="Top performing moments"
            items={data.topMoments}
          />
        ) : (
          <ComingSoonCard icon={StatusDotIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Top performing moments" />
        )}
      </div>
    </div>
  );
}
