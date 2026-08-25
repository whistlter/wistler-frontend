import { UserGroupAltIcon } from "@/components/icons/UserGroupAltIcon";
import { ComingSoonCard } from "@/components/charts/ComingSoonCard";

export function UserBehaviorTab() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <ComingSoonCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Daily active users (DAU)"
          height={60}
        />
        <ComingSoonCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Weekly active users (WAU)"
        />
      </div>

      <div className="flex flex-col gap-4">
        <ComingSoonCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Sessions per user"
          height={60}
        />
        <ComingSoonCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Monthly active users (MAU)"
        />
      </div>

      <ComingSoonCard
        icon={UserGroupAltIcon}
        iconBg="#EAEDFF"
        iconColor="#2845FF"
        title="Average session duration"
      />
    </div>
  );
}
