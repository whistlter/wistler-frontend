// src/components/filter/FilterDropdown.tsx
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Portal } from "../common/Portal";
import type { FilterOption } from "./types";
import { AppIcons } from "@/constant/constant";

type FilterDropdownProps = {
  options: FilterOption[];
  onSelect?: (option: FilterOption) => void;
};

export function FilterDropdown({
  options,
  onSelect,
}: FilterDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Calculate position
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = 130; // w-48
    const dropdownHeight = options.length * 44 + 16;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;

    const openBelow = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove;
    const openRight = spaceRight >= dropdownWidth || spaceRight >= spaceLeft;

    setStyle({
      position: "fixed",
      top: openBelow ? rect.bottom : rect.top - dropdownHeight,
      left: openRight ? rect.left : rect.right - dropdownWidth,
      width: dropdownWidth,
      zIndex: 10000,
    });
  }, [open, options.length]);

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex border border-gray-300 items-center justify-center gap-2 rounded-[10px] cursor-pointer bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <span className="text-gray-400">
          <img src={AppIcons.filter} alt="" className="h-4 w-4" />
        </span>
        <span>Filter</span>
        <span className="text-gray-400">
          <img src={AppIcons.chevronDown} alt="" className="h-4 w-4" />
        </span>
      </button>

      {/* Overlay + Dropdown */}
      {open && (
        <Portal>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[0.5px] transition-opacity"
            style={{ zIndex: 9999 }}
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div
            ref={dropdownRef}
            style={style}
            className="rounded-xl bg-white p-2 shadow-xl mt-1 cursor-pointer "
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect?.(option);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center cursor-pointer gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                )}
              >
                {option.icon && (
                  <span className="text-gray-500">
                    <img src={option.icon} alt="" />
                  </span>
                )}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </Portal>
      )}
    </>
  );
}