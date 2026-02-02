// src/components/filter/FilterDropdown.tsx
import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import clsx from "clsx";
import { Portal } from "../common/Portal";
import type { FilterOption, FilterSubOption } from "./types";
import { AppIcons } from "@/constants/constant";

type FilterDropdownProps = {
  options: FilterOption[];
  onSelect?: (option: FilterOption) => void;
  onSubOptionSelect?: (parentOption: FilterOption, subOption: FilterSubOption) => void;
};

export function FilterDropdown({
  options,
  onSelect,
  onSubOptionSelect,
}: FilterDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuStyle, setSubmenuStyle] = useState<React.CSSProperties>({});

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        subMenuRef.current &&
        !subMenuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Calculate main dropdown position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return {};

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = 200;
    const dropdownHeight = options.length * 48 + 16;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;

    const openBelow = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove;
    const openRight = spaceRight >= dropdownWidth || spaceRight >= spaceLeft;

    return {
      position: "fixed" as const,
      top: openBelow ? rect.bottom + 8 : rect.top - dropdownHeight,
      left: openRight ? rect.left : rect.right - dropdownWidth,
      width: dropdownWidth,
      zIndex: 10000,
    };
  }, [options.length]);

  useLayoutEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStyle(calculatePosition());
    }
  }, [open, calculatePosition]);

  const handleOptionClick = (option: FilterOption, e: React.MouseEvent, buttonRect: DOMRect) => {
    if (option.subOptions && option.subOptions.length > 0) {
      e.stopPropagation();
      setActiveSubmenu(option.value);

      // Calculate submenu position
      const submenuWidth = 180;
      const spaceRight = window.innerWidth - buttonRect.right;

      setSubmenuStyle({
        position: "fixed",
        top: buttonRect.top,
        left: spaceRight >= submenuWidth ? buttonRect.right + 8 : buttonRect.left - submenuWidth - 8,
        width: submenuWidth,
        zIndex: 10001,
      });
    } else {
      onSelect?.(option);
      setOpen(false);
      setActiveSubmenu(null);
    }
  };

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
            onClick={() => {
              setOpen(false);
              setActiveSubmenu(null);
            }}
          />

          {/* Main Dropdown */}
          <div
            ref={dropdownRef}
            style={style}
            className="rounded-xl bg-white p-2 shadow-xl cursor-pointer"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={(e) => {
                  const buttonRect = e.currentTarget.getBoundingClientRect();
                  handleOptionClick(option, e, buttonRect);
                }}
                className={clsx(
                  "flex w-full items-center justify-between cursor-pointer gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#344054] hover:bg-gray-50 transition-colors",
                  activeSubmenu === option.value && "bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  {option.icon && (
                    <span className="text-gray-500 flex items-center">
                      <img src={option.icon} alt="" className="w-4 h-4" />
                    </span>
                  )}
                  <span>{option.label}</span>
                </div>
                <span className="text-gray-400 flex items-center">
                  <img src={AppIcons.chevronrightGrey} alt="" className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>

          {/* Submenu */}
          {activeSubmenu && (
            <div
              ref={subMenuRef}
              style={submenuStyle}
              className="rounded-xl bg-white p-2 shadow-xl"
            >
              {options
                .find((opt) => opt.value === activeSubmenu)
                ?.subOptions?.map((subOption) => (
                  <button
                    key={subOption.value}
                    type="button"
                    onClick={() => {
                      const parentOption = options.find((opt) => opt.value === activeSubmenu)!;
                      onSubOptionSelect?.(parentOption, subOption);
                      setOpen(false);
                      setActiveSubmenu(null);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio/Checkbox indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${subOption.isSelected
                          ? 'border-[#7F56D9] bg-[#7F56D9]'
                          : 'border-[#D0D5DD]'
                        }`}>
                        {subOption.isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${subOption.isSelected ? 'text-[#7F56D9]' : 'text-[#344054]'
                        }`}>
                        {subOption.label}
                      </span>
                    </div>
                    {subOption.isSelected && (
                      <img
                        src={AppIcons.x}
                        alt="Clear"
                        className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </button>
                ))}
            </div>
          )}
        </Portal>
      )}
    </>
  );
}
