import { StatusDotIcon } from "@/components/icons/StatusDotIcon";
import { AiContentGeneratorIcon } from "@/components/icons/AiContentGeneratorIcon";
import { MessageMultipleIcon } from "@/components/icons/MessageMultipleIcon";
import { StatCard } from "@/components/charts/StatCard";
import { ContentPreviewList } from "@/components/charts/ContentPreviewList";
import { useContentPerformanceAnalytics } from "@/features/analytics";

export function ContentPerformanceTab() {
  const { data } = useContentPerformanceAnalytics();
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <StatCard
          icon={AiContentGeneratorIcon}
          iconBg="#EAF0FF"
          iconColor="#2869FF"
          title="Posts created"
          value={data.postsCreated.value}
          description={data.postsCreated.description}
        />
        <StatCard
          icon={StatusDotIcon}
          iconBg="#F5EAFF"
          iconColor="#9B28FF"
          title="Average views per moment"
          value={data.averageViewsPerMoment.value}
          description={data.averageViewsPerMoment.description}
        />
        <StatCard
          icon={StatusDotIcon}
          iconBg="#EAF2FF"
          iconColor="#287AFF"
          title="Completion rate (Moments)"
          value={data.completionRate.value}
          description={data.completionRate.description}
        />
      </div>

      <div className="flex flex-col gap-4">
        <StatCard
          icon={StatusDotIcon}
          iconBg="#FFEAF0"
          iconColor="#FF2869"
          title="Moments created"
          value={data.momentsCreated.value}
          description={data.momentsCreated.description}
        />
        <ContentPreviewList
          icon={AiContentGeneratorIcon}
          iconBg="#FCEAFF"
          iconColor="#E228FF"
          title="Top performing posts"
          items={data.topPosts}
          variant="wide"
        />
      </div>

      <div className="flex flex-col gap-4">
        <StatCard
          icon={MessageMultipleIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Comments per post"
          value={data.commentsPerPost.value}
          description={data.commentsPerPost.description}
        />
        <ContentPreviewList
          icon={StatusDotIcon}
          iconBg="#F5EAFF"
          iconColor="#9B28FF"
          title="Top performing moments"
          items={data.topMoments}
        />
      </div>
    </div>
  );
}
