export const USER_TABLE_VARIANTE = {
    NAME: "name",
    NAME_HEADER: 'Name',
    USERNAME: 'username',
    USERNAME_HEADER: 'Username',
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
export const MOMENT_TOPIC_VARIANTE = {
    TOPIC_NAME: 'topic_name',
    TOPIC_NAME_HEADER: 'Topic Name',
    CATEGORY: 'category',
    CATEGORY_HEADER: 'Category',
    MEMBERS: 'members',
    MEMBERS_HEADER: 'Members',
    POSTS: 'posts',
    POSTS_HEADER: 'Posts',
    CREATED_BY: 'created_by',
    CREATED_BY_HEADER: 'Created By',
    CREATED_DATE: 'createdDate',
    CREATED_DATE_HEADER: 'Created Date',
    STATUS: 'status',
    STATUS_HEADER: 'Status',
} as const;

export const MOMENT_POST_VARIANTE = {
    USER_NAME: 'user_name',
    USER_NAME_HEADER: 'User',
    POST_CONTENT: 'post_content',
    POST_CONTENT_HEADER: 'Post Content',
    TOPIC: 'topic',
    TOPIC_HEADER: 'Topic',
    CATEGORY: 'category',
    CATEGORY_HEADER: 'Category',
    LIKES: 'likes',
    LIKES_HEADER: 'Likes',
    REPLIES: 'replies',
    REPLIES_HEADER: 'Replies',
    DATE_POSTED: 'date_posted',
    DATE_POSTED_HEADER: 'Date Posted',
} as const;

export const MOMENT_MEMBER_VARIANTE = {
    NAME: 'name',
    NAME_HEADER: 'User Name',
    JOIN_DATE: 'join_date',
    JOIN_DATE_HEADER: 'Join Date',
    POSTS: 'posts',
    POSTS_HEADER: 'Posts',
    REPORTS: 'reports',
    REPORTS_HEADER: 'Reports',
} as const;

export const MOMENT_REPORT_VARIANTE = {
    POST_CONTENT: 'post_content',
    POST_CONTENT_HEADER: 'Post Content',
    REPORTED_USER: 'reported_user',
    REPORTED_USER_HEADER: 'Reported User',
    REPORTED_BY: 'reported_by',
    REPORTED_BY_HEADER: 'Reported By',
    REASON: 'reason',
    REASON_HEADER: 'Reason',
    DATE: 'date',
    DATE_HEADER: 'Date',
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
