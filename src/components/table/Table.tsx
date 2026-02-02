// src/components/table/Table.tsx
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { TableColumn, TableAction } from "./types";
import { USER_TABLE_VARIANTE } from "./enum/TableEnum";
import { statusToColor } from "@/utils/helper";

// Portal component for rendering overlay
function Portal({ children }: { children: React.ReactNode }) {
    return typeof document !== 'undefined'
        ? createPortal(children, document.body)
        : null;
}

type TableProps<T> = {
    data: T[];
    columns: TableColumn<T>[];
    actions?: TableAction<T>[];
    loading?: boolean;
};

export function Table<T extends {
    status: string; id: string | number
}>({
    data,
    columns,
    actions,
    loading = false,
}: TableProps<T>) {
    const [openDropdown, setOpenDropdown] = useState<string | number | null>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties | null>(null);
    const triggerRefs = useRef<Map<string | number, HTMLButtonElement>>(new Map());
    const dropdownRef = useRef<HTMLDivElement>(null);
    let Index = 1;
    let MobileIndex = 1;
    // Calculate dropdown position when opened
    useEffect(() => {
        if (openDropdown === null) {
            setDropdownStyle(null);
            return;
        }

        const updatePosition = () => {
            const triggerEl = triggerRefs.current.get(openDropdown);
            if (!triggerEl || !actions) return;

            const rect = triggerEl.getBoundingClientRect();
            const dropdownWidth = 192; // w-48
            const dropdownHeight = actions.length * 52; // More accurate height per item
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            const openBelow = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove;

            const newStyle = {
                position: "fixed" as const,
                top: openBelow ? rect.bottom - 50 : rect.top - dropdownHeight - 50,
                left: rect.right - dropdownWidth - 60,
                width: dropdownWidth,
                zIndex: 10000,
            };

            setDropdownStyle(newStyle);
        };

        // Small delay to ensure DOM is ready
        setTimeout(updatePosition, 0);
    }, [openDropdown, actions]);

    if (loading) {
        const skeletonRows = 10;

        return (
            <>
                {/* Desktop Skeleton */}
                <div className="hidden md:block flex-col items-start gap-2 self-stretch rounded-xl border border-[#E8E8E8] bg-white overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#EFEFF3] bg-[#FCFCFC]">
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className="px-4 py-3 text-left text-sm font-medium text-[#666]"
                                    >
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    </th>
                                ))}
                                {actions && actions.length > 0 && (
                                    <th className="px-4 py-3 text-right">
                                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(skeletonRows)].map((_, rowIdx) => (
                                <tr
                                    key={rowIdx}
                                    className="border-b border-[#EFEFF3] bg-white"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className="px-4 py-4 text-sm align-middle"
                                        >
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-full max-w-[150px]" />
                                        </td>
                                    ))}
                                    {actions && actions.length > 0 && (
                                        <td className="px-4 py-4 text-right align-middle">
                                            <div className="flex justify-end">
                                                <div className="h-8 w-12 bg-gray-200 rounded-lg animate-pulse" />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Skeleton */}
                <div className="md:hidden flex flex-col gap-4">
                    {[...Array(skeletonRows)].map((_, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl border border-[#E8E8E8] bg-white p-4"
                        >
                            {columns.map((col) => (
                                <div
                                    key={String(col.key)}
                                    className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-start gap-2 self-stretch rounded-xl border border-[#E8E8E8] bg-white p-8">
                <div className="flex items-center justify-center w-full py-12 text-gray-500">
                    No data available
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block flex-col items-start gap-2 self-stretch rounded-xl border border-[#E8E8E8] bg-white overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[#EFEFF3] bg-[#FCFCFC]">
                            <th className="px-4 py-6 text-left text-sm font-medium text-[#666]">
                                S/n
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="px-4 py-6 text-left text-sm font-medium text-[#666]"
                                >
                                    {col.header}
                                </th>
                            ))}
                            {actions && actions.length > 0 && (
                                <th className="pl-4 py-3 text-center text-sm font-medium text-[#666]">
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b border-[#EFEFF3] bg-white hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 text-sm text-[#0A0D14] align-middle">{MobileIndex++}</td>
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className="px-4 py-4 text-sm text-[#0A0D14] align-middle"
                                    >
                                        {/* STATUS column – handled internally */}
                                        {col.key === USER_TABLE_VARIANTE.STATUS ? (
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-[5px] border px-3 py-1 text-sm
                ${row.status === "Active"
                                                        ? "border-green-200 bg-green-50 text-green-600"
                                                        : "border-gray-300 bg-gray-50 text-gray-500"
                                                    }
               `}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-[2px] ${statusToColor(row.status)}`}
                                                />
                                                {row.status}
                                            </span>
                                        ) : col.render ? (
                                            col.render(row)
                                        ) : (
                                            (row[col.key] as React.ReactNode)
                                        )}
                                    </td>
                                ))}

                                {/* ACTIONS column */}
                                {actions && actions.length > 0 && (
                                    <td className="px-4 py-4 text-right align-middle">
                                        <div className="flex justify-end">
                                            <button
                                                ref={(el) => {
                                                    if (el) {
                                                        triggerRefs.current.set(`desktop-${row.id}`, el);
                                                    } else {
                                                        triggerRefs.current.delete(`desktop-${row.id}`);
                                                    }
                                                }}
                                                onClick={() =>
                                                    setOpenDropdown(
                                                        openDropdown === `desktop-${row.id}`
                                                            ? null
                                                            : `desktop-${row.id}`
                                                    )
                                                }
                                                className="rounded-[10px] bg-white border border-gray-200 px-5 py-1 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                <span className="text-gray-400 text-lg">⋯</span>
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col gap-4">
                {data.map((row) => (
                    <div
                        key={row.id}
                        className="rounded-xl border border-[#E8E8E8] bg-white p-4"
                    >
                        <div className="flex border-b border-gray-100 py-2">
                            <div className="text-sm font-medium text-[#666] flex-shrink-0 w-1/3">S/n</div>
                            <div className="text-sm text-[#0A0D14] flex-1 text-right">{Index++}</div>

                        </div>
                        {columns.map((col) => (

                            <div
                                key={String(col.key)}
                                className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0"
                            >
                                {/* Label */}
                                <span className="text-sm font-medium text-[#666] flex-shrink-0 w-1/3">
                                    {col.header}
                                </span>

                                {/* Value */}
                                <span className="text-sm text-[#0A0D14] flex-1 text-right">
                                    {/* STATUS column – handled internally */}
                                    {col.key === USER_TABLE_VARIANTE.STATUS ? (
                                        <span
                                            className={`inline-flex items-center gap-2 rounded-[5px] border px-3 py-1 text-sm ${row.status === "Active"
                                                ? "border-green-200 bg-green-50 text-green-600"
                                                : "border-gray-300 bg-gray-50 text-gray-500"
                                                }
           `}
                                        >
                                            <span
                                                className={`h-2 w-2 rounded-[2px] ${row.status === "Active"
                                                    ? "bg-green-600"
                                                    : "bg-gray-400"
                                                    }`}
                                            />
                                            {row.status}
                                        </span>
                                    ) : col.render ? (
                                        col.render(row)
                                    ) : (
                                        (row[col.key] as React.ReactNode)
                                    )}
                                </span>
                            </div>
                        ))}
                        {actions && actions.length > 0 && (
                            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 ">
                                <button
                                    ref={(el) => {
                                        if (el) {
                                            triggerRefs.current.set(`mobile-${row.id}`, el);
                                        } else {
                                            triggerRefs.current.delete(`mobile-${row.id}`);
                                        }
                                    }}
                                    onClick={() =>
                                        setOpenDropdown(openDropdown === `mobile-${row.id}` ? null : `mobile-${row.id}`)
                                    }
                                    className="rounded-[10px] cursor-pointer bg-white border border-gray-200 px-5 py-1 text-sm text-gray-600"
                                >
                                    <span className="text-gray-400 text-lg cursor-pointer">⋯</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Overlay + Dropdown Portal */}
            {openDropdown !== null && actions && dropdownStyle && (
                <Portal>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-[0.5px] transition-opacity"
                        style={{ zIndex: 9999 }}
                        onClick={() => setOpenDropdown(null)}
                    />

                    {/* Dropdown */}
                    <div
                        ref={dropdownRef}
                        style={dropdownStyle}
                        className="rounded-lg border border-gray-200 bg-white shadow-xl"
                    >
                        {actions.map((action, idx) => {
                            const actualId = typeof openDropdown === 'string'
                                ? openDropdown.replace(/^(desktop|mobile)-/, '')
                                : openDropdown;
                            const row = data.find(r => String(r.id) === String(actualId));

                            // Use dynamic properties if available, otherwise fall back to static
                            const label = row && action.getLabel ? action.getLabel(row) : action.label;
                            const icon = row && action.getIcon ? action.getIcon(row) : action.icon;
                            const isDanger = row && action.getDanger ? action.getDanger(row) : action.danger;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (row) {
                                            action.onClick(row);
                                            setOpenDropdown(null);
                                        }
                                    }}
                                    className={`flex w-[95%] items-center gap-3 px-4 m-1 py-2 text-left text-[13px]transition-colors cursor-pointer ${isDanger
                                        ? "flex  items-center cursor-pointer gap-3 rounded-lg px-2 py-2 text-[13px] text-red-700  hover:bg-red-50"
                                        : "flex  items-center cursor-pointer gap-3 rounded-lg px-2 py-2 text-[13px]text-gray-700 hover:bg-gray-100"
                                        } ${idx !== actions.length - 1 ? "flex  items-center cursor-pointer gap-3 rounded-lg px-2 py-2 text-[13px] text-gray-700 hover:bg-gray-100" : ""} ${idx === 0 ? "rounded-t-lg" : ""
                                        } ${idx === actions.length - 1 ? "rounded-b-lg" : ""}`}
                                >
                                    {icon && typeof icon === "string" ? (
                                        <img src={icon} alt="" className="h-4 w-4" />
                                    ) : (
                                        icon
                                    )}
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </Portal>
            )}
        </>
    );
}