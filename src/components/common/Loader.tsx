export function Loader({
    text = "Loading...",
    fullScreen = false,
}: {
    text?: string;
    fullScreen?: boolean;
}) {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-rose-500" />
            {text && <p className="text-sm font-medium text-gray-500">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return <div className="flex w-full items-center justify-center py-8">{content}</div>;
}
