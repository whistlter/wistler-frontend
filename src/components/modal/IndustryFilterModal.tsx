import { useState } from "react";
import { AppIcons } from "@/constants/constant";

interface IndustryFilterModalProps {
    close: () => void;
    onApply?: (selectedIndustries: string[]) => void;
    currentIndustries?: string[];
}

export function IndustryFilterModal({ close, onApply, currentIndustries = [] }: IndustryFilterModalProps) {
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>(currentIndustries);

    const industryOptions = [
        { label: "All", value: "all" },
        { label: "Technology", value: "technology" },
        { label: "Healthcare", value: "healthcare" },
        { label: "Finance", value: "finance" },
        { label: "Education", value: "education" },
        { label: "Retail", value: "retail" },
    ];

    const handleIndustryToggle = (value: string) => {
        if (value === "all") {
            setSelectedIndustries([]);
            onApply?.([]);
            close();
        } else {
            const newSelected = selectedIndustries.includes(value)
                ? selectedIndustries.filter(s => s !== value)
                : [...selectedIndustries, value];
            setSelectedIndustries(newSelected);
            onApply?.(newSelected);
        }
    };

    const isAllSelected = selectedIndustries.length === 0;

    return (
        <div className="bg-white rounded-2xl w-full max-w-[280px] p-4">
            <div className="space-y-1">
                {industryOptions.map((option) => {
                    const isSelected = option.value === "all"
                        ? isAllSelected
                        : selectedIndustries.includes(option.value);

                    return (
                        <button
                            key={option.value}
                            onClick={() => handleIndustryToggle(option.value)}
                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                {/* Radio/Checkbox indicator */}
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected
                                        ? 'border-[#7F56D9] bg-[#7F56D9]'
                                        : 'border-gray-300'
                                }`}>
                                    {isSelected && (
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    )}
                                </div>
                                <span className={`text-sm font-medium ${
                                    isSelected ? 'text-[#7F56D9]' : 'text-[#344054]'
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
