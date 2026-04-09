export function formatTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffCalendarDays = Math.round((today.getTime() - dateDay.getTime()) / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24 && diffCalendarDays === 0) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffCalendarDays === 1) return 'Yesterday';
    return `${diffCalendarDays} days ago`;
}
