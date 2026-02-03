import { useState } from "react";
import { AppIcons } from "@/constants/constant";

interface StatusFilterModalProps {
    close: () => void;
    onApply?: (selectedStatuses: string[]) => void;
    currentStatuses?: string[];
}

export function StatusFilterModal({ onApply, currentStatuses = [] }: StatusFilterModalProps) {
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(currentStatuses);

    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "deactivate" },
    ];

    const handleStatusToggle = (value: string) => {
        const newSelected = selectedStatuses.includes(value)
            ? selectedStatuses.filter(s => s !== value)
            : [...selectedStatuses, value];
        setSelectedStatuses(newSelected);
        onApply?.(newSelected);
    };

    return (
        <div className="bg-white rounded-2xl w-full max-w-[280px] p-4">
            <div className="space-y-1">
                {statusOptions.map((option) => {
                    const isSelected = selectedStatuses.includes(option.value);

                    return (
                        <button
                            key={option.value}
                            onClick={() => handleStatusToggle(option.value)}
                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                {/* Radio/Checkbox indicator */}
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                    ? 'border-[#E31C5F] bg-[#E31C5F]'
                                    : 'border-gray-300'
                                    }`}>
                                    {isSelected && (
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    )}
                                </div>
                                <span className={`text-sm font-medium ${isSelected ? 'text-[#E31C5F]' : 'text-[#344054]'
                                    }`}>
                                    {option.label}
                                </span>
                            </div>
                            {isSelected && (
                                <img
                                    src={AppIcons.x}
                                    alt="Clear"
                                    className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
