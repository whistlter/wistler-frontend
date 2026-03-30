// Moment member types

export type MomentMemberRowDTO = {
    id: number;
    name: string;
    join_date: string;
    posts: string;
    reports: string;
    image?: string | null;
};

export type MomentMemberApi = {
    id: number;
    moment_id?: number;
    user_id?: number;
    posts_count?: number;
    reports_count?: number;
    createdAt?: string;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        image?: string | null;
    };
};

export function mapMomentMemberToRowDTO(member: MomentMemberApi): MomentMemberRowDTO {
    const name = member.user
        ? `${member.user.first_name ?? ''} ${member.user.last_name ?? ''}`.trim() || member.user.username
        : 'Unknown';

    return {
        id: member.user?.id ?? member.id,
        name,
        join_date: member.createdAt
            ? new Date(member.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            })
            : 'N/A',
        posts: (member.posts_count ?? 0).toString(),
        reports: (member.reports_count ?? 0).toString(),
        image: member.user?.image,
    };
}
