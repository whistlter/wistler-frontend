import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type MultiSelectOption = {
    value: string | number;
    label: string;
};

interface MultiSelectProps {
    data: MultiSelectOption[];
    value?: (string | number)[];
    onChange?: (value: (string | number)[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const MultiSelectComponent: React.FC<MultiSelectProps> = ({
    data,
    value = [],
    onChange,
    placeholder = "Select options",
    disabled = false,
}) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [style, setStyle] = useState<React.CSSProperties>({});

    const selectedOptions = data.filter((option) => value.includes(option.value));
    const displayText = selectedOptions.length > 0
        ? selectedOptions[0].label
        : placeholder;

    const ITEM_HEIGHT = 44;
    const MAX_VISIBLE_ITEMS = 5;
    const DROPDOWN_PADDING = 8;

    /* -------------------------------
       POSITIONING (FLIP SAFE)
    -------------------------------- */
    useEffect(() => {
        if (!open || !triggerRef.current) return;

        const updatePosition = () => {
            if (!triggerRef.current) return;

            const rect = triggerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const dropdownHeight =
                Math.min(data.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT +
                DROPDOWN_PADDING;

            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

            setStyle({
                position: "fixed",
                top: openUpward
                    ? rect.top - dropdownHeight - 6
                    : rect.bottom + 6,
                left: rect.left,
                width: rect.width,
                maxHeight: dropdownHeight,
                zIndex: 10000,
            });
        };

        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [open, data.length]);

    /* -------------------------------
       OUTSIDE CLICK
    -------------------------------- */
    useEffect(() => {
        if (!open) return;

        const handler = (e: MouseEvent) => {
            if (
                !triggerRef.current?.contains(e.target as Node) &&
                !dropdownRef.current?.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    /* -------------------------------
       TOGGLE SELECTION
    -------------------------------- */
    const toggleOption = (optionValue: string | number) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange?.(newValue);
    };

    return (
        <>
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((v) => !v)}
                className="
                    w-full flex items-center justify-between
                    rounded-xl px-4 py-3 text-[13px] font-medium
                    bg-white text-[#0A0D14]
                    border border-[#E8E8E8]
                    shadow-[0_1px_1px_rgba(0,0,0,0.03)]
                    focus:outline-none
                    focus:border-[#EB003D]
                    focus:shadow-[0_1px_1px_rgba(0,0,0,0.03)]
                    transition
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                "
            >
                <span className={selectedOptions.length > 0 ? "text-[#0A0D14]" : "text-[#969696]"}>
                    {displayText}
                    {selectedOptions.length > 1 && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-[#FF2860] text-white rounded-full">
                            +{selectedOptions.length - 1}
                        </span>
                    )}
                </span>

                <svg
                    className="h-4 w-4 text-[#969696]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            {open &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={style}
                        className="
                            rounded-xl bg-white
                            border border-[#EFEFF3]
                            shadow-xl
                            overflow-y-auto
                        "
                    >
                        {data.map((option) => {
                            const isChecked = value.includes(option.value);
                            return (
                                <label
                                    key={option.value}
                                    className="
                                        w-full flex items-center gap-3 px-4 py-3 text-[13px]
                                        hover:bg-[#FFF5F8]
                                        transition-colors cursor-pointer
                                    "
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleOption(option.value)}
                                        className="
                                            w-4 h-4 rounded
                                            border-2 border-[#E8E8E8]
                                            text-[#FF2860]
                                            focus:ring-2 focus:ring-[#FF2860] focus:ring-opacity-50
                                            cursor-pointer
                                            checked:bg-[#FF2860]
                                            checked:border-[#FF2860]
                                        "
                                        style={{
                                            accentColor: '#FF2860'
                                        }}
                                    />
                                    <span className={isChecked ? "text-[#0A0D14] font-medium" : "text-[#0A0D14]"}>
                                        {option.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>,
                    document.body
                )}
        </>
    );
};
