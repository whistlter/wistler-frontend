import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SelectOption = {
    value: string | number;
    label: string;
};

interface SelectProps {
    data: string[] | number[] | SelectOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const SelectComponent: React.FC<SelectProps> = ({
    data,
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
}) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | number>();
    const [style, setStyle] = useState<React.CSSProperties>({});

    const currentValue = value ?? internalValue;

    const options: SelectOption[] = data.map((item) =>
        typeof item === "object" && "value" in item
            ? item
            : { value: item, label: String(item) }
    );

    const selectedOption = options.find((o) => o.value === currentValue);

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
                Math.min(options.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT +
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
    }, [open, options.length]);

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
       SELECT
    -------------------------------- */
    const selectOption = (val: string | number) => {
        onChange?.(val);
        setInternalValue(val);
        setOpen(false);
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
                <span className={selectedOption ? "text-[#0A0D14]" : "text-[#969696]"}>
                    {selectedOption?.label ?? placeholder}
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
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => selectOption(option.value)}
                                className="
                  w-full text-left px-4 py-3 text-[13px]
                  hover:bg-[#F9F9F9]
                  transition-colors cursor-pointer
                "
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    );
};