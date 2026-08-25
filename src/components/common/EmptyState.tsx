import type { ComponentType } from "react";
import { Inbox } from "lucide-react";

type EmptyStateIcon = ComponentType<{ size?: number; className?: string }>;

type EmptyStateAction = {
    label: string;
    onClick: () => void;
};

type Props = {
    icon?: EmptyStateIcon;
    title?: string;
    description?: string;
    action?: EmptyStateAction;
    /** "card" wraps in the same bordered card shell used across list/table views; "plain" renders just the centered content. */
    variant?: "card" | "plain";
    className?: string;
};

export function EmptyState({
    icon: Icon = Inbox,
    title = "Nothing here yet",
    description,
    action,
    variant = "card",
    className = "",
}: Props) {
    const content = (
        <div className={`flex w-full flex-col items-center justify-center gap-3 py-12 text-center ${className}`}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5] text-[#969696]">
                <Icon size={22} />
            </span>
            <div className="flex flex-col gap-1">
                <p className="text-[14px] font-semibold text-[#1A1A1A]">{title}</p>
                {description && (
                    <p className="max-w-[320px] text-[13px] font-medium text-[#969696]">{description}</p>
                )}
            </div>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-2 cursor-pointer rounded-lg border border-[#E8E8E8] px-4 py-2 text-[13px] font-medium text-[#0A0D14] transition-colors hover:bg-[#FAFAFA]"
                >
                    {action.label}
                </button>
            )}
        </div>
    );

    if (variant === "plain") return content;

    return (
        <div className="flex flex-col items-center gap-2 self-stretch rounded-xl border border-[#E8E8E8] bg-white p-8">
            {content}
        </div>
    );
}
