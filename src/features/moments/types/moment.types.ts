// Moment topic types

export type MomentRowDTO = {
    id: number;
    topic_name: string;
    category: string;
    members: string;
    posts: string;
    created_by: string;
    createdDate: string;
    status: "Active" | "in-active";
};

export type MomentApi = {
    id: number;
    post?: string;                           // topic content from API
    description?: string;
    image?: string | null;
    interest_id?: number;
    moment_parent_id?: number | null;
    user_id?: number;
    likes_count?: number;
    comments_count?: number;                 // posts/comments within the topic
    is_anonymous?: string;
    status?: string;
    is_pinned?: boolean;
    deleted_at?: string | null;
    is_deleted?: boolean;
    memberCount?: number;                    // camelCase from API
    interest?: {
        id: number;
        title: string;
        image?: string | null;
    };
    user?: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        image?: string | null;
    };
    createdAt?: string;
    updatedAt?: string;
    // legacy fields kept for backward compatibility
    title?: string;
    category?: string;
    members_count?: number;
    posts_count?: number;
    reports_count?: number;
    is_suspended?: boolean;
};

export function mapMomentToRowDTO(moment: MomentApi): MomentRowDTO {
    const isInactive = moment.is_suspended || moment.status === 'in-active' || moment.is_deleted;

    return {
        id: moment.id,
        topic_name: moment.post ?? moment.title ?? '',
        category: moment.interest?.title ?? moment.category ?? 'N/A',
        members: (moment.memberCount ?? moment.members_count ?? 0).toString(),
        posts: (moment.comments_count ?? moment.posts_count ?? 0).toString(),
        created_by: moment.user
            ? `${moment.user.first_name ?? ''} ${moment.user.last_name ?? ''}`.trim() || moment.user.username
            : 'N/A',
        createdDate: moment.createdAt
            ? new Date(moment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            })
            : 'N/A',
        status: isInactive ? 'in-active' : 'Active',
    };
}
