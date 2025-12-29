// src/components/common/ActionDropdown.tsx
import { useLayoutEffect, useRef, useState } from "react";
import { Portal } from "./Portal";

type Action = {
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
};

type ActionDropdownProps = {
  trigger: React.ReactNode;
  actions: Action[];
};

export function ActionDropdown({
  trigger,
  actions,
}: ActionDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({
    visibility: "hidden",
  });

  // Close on outside click
  useLayoutEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !triggerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Position (side-aligned)
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !dropdownRef.current) return;

    const t = triggerRef.current.getBoundingClientRect();
    const d = dropdownRef.current.getBoundingClientRect();

    setStyle({
      position: "fixed",
      top: t.top + t.height / 2 - d.height / 2,
      left: t.left - d.width - 8,
      zIndex: 9999,
      visibility: "visible",
    });
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center"
      >
        {trigger}
      </button>

      {open && (
        <Portal>
          <div
            ref={dropdownRef}
            style={style}
            className="w-44 rounded-xl border-gray-200 p-2 shadow-xl"
          >
            {actions.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  a.onClick();
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer ${
                  a.danger
                    ? "text-red-500 hover:bg-red-50"
                    : "hover:bg-gray-100"
                }`}
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </>
  );
}