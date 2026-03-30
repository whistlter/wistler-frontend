// Moment report types

export type MomentReportRowDTO = {
    id: number;
    post_id: number;
    post_content: string;
    reported_user: string;
    reported_user_id: number;
    reported_user_image?: string | null;
    reported_user_status: string;
    reported_by: string;
    reason: string;
    date: string;
    image?: string | null;
    raw_post?: string;
    topic: string;
    category: string;
    flags_count: number;
    reports_count: number;
    reach_count: number;
    participants_count: number;
    likes_count: number;
    comments_count: number;
};

export type MomentReportApi = {
    id: number;
    moment_id?: number;
    post_id?: number;
    reason?: string;
    createdAt?: string;
    post?: {
        id: number;
        post: string;
        image?: string | null;
        likes_count?: number;
        comments_count?: number;
        flags_count?: number;
        reports_count?: number;
        reach_count?: number;
        participants_count?: number;
        user?: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            image?: string | null;
            status?: string;
        };
        moment?: {
            id: number;
            title: string;
            interest?: {
                id: number;
                title: string;
            };
        };
    };
    reporter?: {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
    };
};

export function mapMomentReportToRowDTO(report: MomentReportApi): MomentReportRowDTO {
    const reportedUser = report.post?.user
        ? `${report.post.user.first_name ?? ''} ${report.post.user.last_name ?? ''}`.trim() || report.post.user.username
        : 'Unknown';

    const reportedBy = report.reporter
        ? `${report.reporter.first_name ?? ''} ${report.reporter.last_name ?? ''}`.trim() || report.reporter.username
        : 'Unknown';

    return {
        id: report.id,
        post_id: report.post?.id ?? 0,
        post_content: report.post?.post ?? '',
        reported_user: reportedUser,
        reported_user_id: report.post?.user?.id ?? 0,
        reported_user_image: report.post?.user?.image,
        reported_user_status: report.post?.user?.status ?? 'active',
        reported_by: reportedBy,
        reason: report.reason ?? 'N/A',
        date: report.createdAt
            ? new Date(report.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            })
            : 'N/A',
        image: report.post?.image,
        raw_post: report.post?.post,
        topic: report.post?.moment?.title ?? 'N/A',
        category: report.post?.moment?.interest?.title ?? 'N/A',
        flags_count: report.post?.flags_count ?? 0,
        reports_count: report.post?.reports_count ?? 0,
        reach_count: report.post?.reach_count ?? 0,
        participants_count: report.post?.participants_count ?? 0,
        likes_count: report.post?.likes_count ?? 0,
        comments_count: report.post?.comments_count ?? 0,
    };
}
