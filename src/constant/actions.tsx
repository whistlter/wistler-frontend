export const ActionType = {
    DELETE: 'Delete',
    SUSPEND_COMMUNITY: 'Suspend community',
    SUSPEND_USER: 'Suspend user',
    RESTORE: 'Restore',
    MOVE_TO_REVIEW: 'Move to review',
    TAKE_DOWN: 'Take down',
    BAN_USER: 'Ban user',
    SHADOW_BAN: 'Shadowban',
    UPDATE_ROLE: 'Update role',
    REMOVE_USER: 'Remove user',
    SEND_RESET_INSTRUCTION: 'Send reset instructions',
    VIEW_POST: 'View post',
    VIEW_PROFILE: 'View profile',
    VIEW_COMMUNITY: 'View community',
    CHANGE_ROLE: 'Change role',
    VIEW: 'View',
    EDIT: 'Edit',
    MANAGE_MODERATORS: 'Manage Moderators',
    SHADOW_BAN_USER: 'Shadowban user',
    RESET_PASSWORD: 'Reset password',
    LOGOUT: 'Logout'
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];