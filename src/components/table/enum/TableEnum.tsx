export const USER_TABLE_VARIANTE = {
    NAME: "name",
    NAME_HEADER: 'Name',
    EMAIL: 'email',
    EMAIL_HEADER: 'Email',
    COMMUNITIES: 'communities',
    COMMUNITIES_HEADER: 'Communities',
    ROLE: 'role',
    ROLE_HEADER: 'Role',
    STATUS: 'status',
    STATUS_HEADER: 'Status',
    JOINED_DATE: 'joinedDate',
    JOINED_DATE_HEADER: 'Joined date',

} as const;
export const COMMUNITY_MEMBERS_VARIANTE = {
    NAME: "name",
    NAME_HEADER: 'Name',
    ROLE: 'role',
    ROLE_HEADER: 'Role',
    POSTS: 'posts',
    POST_HEADER: 'Posts',
    STATUS: 'status',
    STATUS_HEADER: 'Status',
    LAST_SEEN: 'last_seen',
    LAST_SEEN_HEADER: 'Status',
    JOINED_DATE: 'joinedDate',
    JOINED_DATE_HEADER: 'Joined date',

} as const;
export const COMMUNITY_POST_VARIANTE = {
    CAPTION: "caption",
    CAPTION_HEADER: 'caption',
    AUTHOR: 'author',
    AUTHOR_HEADER: 'Author',
    FLAGS: 'flags',
    FLAGS_HEADER: 'Flags',
    STATUS: 'status',
    STATUS_HEADER: 'Status',
    POSTED_ON: 'Posted_on',
    POSTED_ON_HEADER: 'Posted on',

} as const;

export const COMMUNITY_TABLE_VARIANTE = {
    NAME: "Community_Name",
    NAME_HEADER: 'Community Name',
    MEMBERS: 'members',
    MEMBERS_HEADER: 'Members',
    VISIBILITY: 'visibility',
    VISIVILITY_HEADER: 'Visibility',
    STATUS: 'status',
    STATUS_HEADER: 'Status',
    JOINED_DATE: 'joinedDate',
    JOINED_DATE_HEADER: 'Joined date',

} as const;
export const FLAGGED_CONTENT_VARIANTE = {
    CONTENT_PREVIEW: "content_preview",
    CONTENT_PREVIEW_HEADER: 'Content preview',
    REASON: 'reason',
    REASON_HEADER: 'Reason',
    FLAGS: 'flags',
    FLAGS_HEADER: 'Flags',
    COMMUNITY: 'community',
    COMMUNITY_HEADER: 'Community',
} as const;

export const REVIEW_QUEUE_VARIANTE = {
    CONTENT: "content",
    CONTENT_HEADER: 'Content',
    REASON: 'reason',
    REASON_HEADER: 'Reason',
    DATE: 'date',
    DATE_HEADER: 'Date',
} as const;
