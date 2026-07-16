import type {
  OverviewAnalytics,
  UserBehaviorAnalytics,
  GrowthRetentionAnalytics,
  ContentPerformanceAnalytics,
  CommunityPerformanceAnalytics,
  MomentsInsightsAnalytics,
} from "../types/analytics.types";

const contentPreviewItems = (communityName?: string) => [
  {
    id: "1",
    category: "Work & Career",
    title: "Finding My Career Path",
    likes: 11,
    comments: 13,
    communityName,
  },
  {
    id: "2",
    category: "Work & Career",
    title: "Finding My Career Path",
    likes: 11,
    comments: 13,
    communityName,
  },
  {
    id: "3",
    category: "Work & Career",
    title: "Finding My Career Path",
    likes: 11,
    comments: 13,
    communityName,
  },
];

export const overviewAnalyticsMock: OverviewAnalytics = {
  totalUsers: {
    value: "24,820",
    trend: { direction: "up", label: "+8% vs last 7 days" },
    description: "Total number of registered users.",
  },
  activeUsers: {
    value: "8,420",
    trend: { direction: "up", label: "+5%" },
    description: "Users who joined during the selected period",
  },
  totalCommunities: {
    value: "320",
    description: "Total number of communities created.",
  },
  activeCommunities: {
    value: "210",
    trend: { direction: "up", label: "+6%" },
    description: "Communities with activity in the selected period",
  },
  contentCreated: {
    value: "5,840",
    trend: { direction: "up", label: "+10%" },
    description: "Posts and Moments shared in the selected period",
    breakdown: [
      { label: "Posts: 3,200", color: "#0A68FF" },
      { label: "Moments: 2,640", color: "#FF2860" },
    ],
  },
  userActivityBreakdown: {
    data: [
      { label: "Posting", value: 13000 },
      { label: "Commenting", value: 5000 },
      { label: "Viewing", value: 10500 },
      { label: "Reacting", value: 18500 },
    ],
    activeLabel: "Reacting",
    legend: [
      { label: "Posting", color: "#EFEFEF" },
      { label: "Commenting", color: "#EFEFEF" },
      { label: "Viewing", color: "#EFEFEF" },
      { label: "Reacting", color: "#2873FF" },
    ],
  },
  totalInteractions: {
    centerValue: "18,240",
    segments: [
      { label: "Likes", value: 9876, displayValue: "9,876", color: "#324DFF" },
      { label: "Comments", value: 8765, displayValue: "8,765", color: "#FF9F0A" },
      { label: "Reactions", value: 7654, displayValue: "7,654", color: "#3FC8E4" },
      { label: "Replies", value: 6543, displayValue: "6,543", color: "#1DBF73" },
    ],
  },
};

export const userBehaviorAnalyticsMock: UserBehaviorAnalytics = {
  weeklyActiveUsers: {
    data: [
      { label: "Week 1", value: 14500 },
      { label: "Week 2", value: 5100 },
      { label: "Week 3", value: 12000 },
      { label: "Week 4", value: 19800 },
    ],
    activeLabel: "Week 4",
  },
  sessionsPerUser: {
    value: "7,891",
    description: "Average number of sessions per user",
  },
  monthlyActiveUsers: {
    data: [
      { label: "Jan", value: 14500 },
      { label: "Feb", value: 5100 },
      { label: "Mar", value: 12000 },
      { label: "Apr", value: 19800 },
      { label: "May", value: 12000 },
      { label: "Jun", value: 12000 },
    ],
    activeLabel: "Apr",
  },
  dailyActiveUsers: {
    value: "5,432",
    description: "Number of unique users active per day",
  },
  averageSessionDuration: {
    data: [
      { label: "Jan", value: 150 },
      { label: "", value: 1150 },
      { label: "Feb", value: 1300 },
      { label: "", value: 950 },
      { label: "Mar", value: 1000 },
      { label: "", value: 1300 },
      { label: "Apr", value: 1500 },
      { label: "May", value: 2600 },
      { label: "Jun", value: 4500 },
    ],
    value: "6m 42s",
    valueLabel: "Average Session",
    trend: { direction: "down", label: "12%" },
  },
};

export const growthRetentionAnalyticsMock: GrowthRetentionAnalytics = {
  userGrowthTrend: {
    data: [
      { label: "Jan", value: 40000 },
      { label: "Feb", value: 55000 },
      { label: "Mar", value: 62000 },
      { label: "Apr", value: 71000 },
      { label: "May", value: 82000 },
      { label: "Jun", value: 91000 },
      { label: "Jul", value: 100234 },
    ],
    activeLabel: "Jun",
    value: "100,234 Users",
    trend: { direction: "up", label: "+14% vs last 7 days" },
  },
  userComposition: {
    data: [
      { label: "Jan", value: 2200, secondaryValue: 2800 },
      { label: "Feb", value: 3200, secondaryValue: 1300 },
      { label: "Mar", value: 2200, secondaryValue: 1300 },
      { label: "Apr", value: 5000, secondaryValue: 2000 },
      { label: "May", value: 2200, secondaryValue: 2300 },
      { label: "Jun", value: 2200, secondaryValue: 1000 },
    ],
    activeLabel: "Apr",
    legend: [
      { label: "New Users", color: "#2873FF" },
      { label: "Returning Users", color: "#EFEFEF" },
    ],
  },
  userGrowthRate: {
    value: "+18%",
    trend: { direction: "up", label: "+4% vs last period" },
    description: "Percentage increase in total users over the selected period.",
  },
  retentionRate: {
    centerValue: "64%",
    rings: [
      { label: "Day 1", value: 31, proportion: 16, color: "#FB3B52" },
      { label: "Day 7", value: 48, proportion: 24, color: "#5654D4" },
      { label: "Day 30", value: 72, proportion: 60, color: "#3FC8E4" },
    ],
  },
  newUsers: {
    value: "2,430",
    trend: { direction: "up", label: "+12%" },
    description: "Number of users who joined during the selected period",
  },
  returningUsers: {
    value: "1,980",
    trend: { direction: "up", label: "+6%" },
    description: "Users who came back after their first session.",
  },
};

export const contentPerformanceAnalyticsMock: ContentPerformanceAnalytics = {
  topMoments: contentPreviewItems(),
  topPosts: contentPreviewItems("Tech Innovators"),
  postsCreated: {
    value: "10,234",
    description: "Total posts in selected period",
  },
  averageViewsPerMoment: {
    value: "344",
    description: "Total average views",
  },
  completionRate: {
    value: "6,789",
    description: "How many users viewed till end",
  },
  momentsCreated: {
    value: "1,023",
    description: "Total moments shared",
  },
  commentsPerPost: {
    value: "3,456",
    description: "Engagement level",
  },
};

export const communityPerformanceAnalyticsMock: CommunityPerformanceAnalytics = {
  communityActivityStatus: {
    centerValue: "1,424",
    trend: { direction: "up", label: "+5% vs last month" },
    segments: [
      { label: "Active", value: 1345, displayValue: "1,345", color: "#3FC8E4" },
      { label: "Inactive", value: 79, displayValue: "79", color: "#EFEFEF" },
    ],
  },
  mostActiveCommunities: [
    { label: "Creative Minds Lounge", value: 1240, displayValue: "1,240 actions" },
    { label: "Tech Rookies", value: 980, displayValue: "980 actions" },
    { label: "Side Hustlers Hub", value: 860, displayValue: "860 actions" },
    { label: "Entrepreneurs' Oasis", value: 820, displayValue: "820 actions" },
    { label: "Freelancers' Haven", value: 780, displayValue: "780 actions" },
  ],
  postsPerCommunity: {
    data: [
      { label: "Jan", value: 14500 },
      { label: "Feb", value: 5100 },
      { label: "Mar", value: 12000 },
      { label: "Apr", value: 19800 },
      { label: "May", value: 12000 },
      { label: "Jun", value: 12000 },
    ],
    activeLabel: "Apr",
  },
  engagementPerCommunity: {
    data: [
      { label: "Jan", value: 14500 },
      { label: "Feb", value: 5100 },
      { label: "Mar", value: 12000 },
      { label: "Apr", value: 19800 },
      { label: "May", value: 12000 },
      { label: "Jun", value: 12000 },
      { label: "Jul", value: 12000 },
      { label: "Aug", value: 12000 },
      { label: "Sep", value: 12000 },
    ],
    activeLabel: "Apr",
  },
  communityGrowthRate: {
    value: "+18%",
    trend: { direction: "up", label: "+5% vs last period" },
    description: "Rate at which communities are gaining new members.",
  },
  averageMembersPerCommunity: {
    value: "342",
    trend: { direction: "up", label: "+9%" },
    description: "Average number of members across all communities",
  },
};

export const momentsInsightsAnalyticsMock: MomentsInsightsAnalytics = {
  engagementPerMoment: {
    value: "24 interactions",
    trend: { direction: "down", label: "3%" },
    description: "Average number of reactions and replies per moment",
  },
  averageViewsPerMoment: {
    value: "128",
    trend: { direction: "up", label: "+10%" },
    description: "Average number of views each moment receives.",
  },
  usersDropOff: {
    value: "7,257 users",
    trend: { direction: "up", label: "+14% vs last 7 days" },
    steps: [
      { label: "Viewed", value: "3,456" },
      { label: "Stayed halfway", value: "2,789" },
      { label: "Active", value: "1,012" },
    ],
  },
  topMoments: contentPreviewItems(),
  momentsActivityTrend: {
    data: [
      { label: "Jan", value: 4000 },
      { label: "", value: 4650 },
      { label: "", value: 4300 },
      { label: "", value: 5100 },
      { label: "Feb", value: 5500 },
      { label: "", value: 5050 },
      { label: "", value: 5900 },
      { label: "", value: 6350 },
      { label: "Mar", value: 6200 },
      { label: "", value: 6700 },
      { label: "", value: 6300 },
      { label: "", value: 7250 },
      { label: "Apr", value: 7100 },
      { label: "", value: 7600 },
      { label: "", value: 7350 },
      { label: "", value: 8100 },
      { label: "May", value: 8200 },
      { label: "", value: 7800 },
      { label: "", value: 8600 },
      { label: "", value: 8350 },
      { label: "Jun", value: 9100 },
      { label: "", value: 8750 },
      { label: "", value: 9450 },
      { label: "", value: 9200 },
      { label: "Jul", value: 10123 },
    ],
    activeLabel: "Jun",
    value: "10,123 moments",
    trend: { direction: "up", label: "+14% vs last 7 days" },
  },
  momentsCreated: {
    value: "1,284",
    trend: { direction: "up", label: "+14% vs last 7 days" },
    description: "Total number of moments shared within the selected period",
  },
  activeMoments: {
    value: "342",
    trend: { direction: "up", label: "+6%" },
    description: "Moments currently visible within their active duration",
  },
};
