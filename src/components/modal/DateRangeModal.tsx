import { useState } from "react";
import { AppIcons } from "@/constants/constant";
import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";

interface DateRangeModalProps {
    close: () => void;
    onApply?: (startDate: string, endDate: string) => void;
}

export function DateRangeModal({ close, onApply }: DateRangeModalProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handleDateClick = (day: number, isStartDate: boolean) => {
        const monthNum = String(currentMonth + 1).padStart(2, '0');
        const dayNum = String(day).padStart(2, '0');
        const dateStr = `${currentYear}-${monthNum}-${dayNum}`;

        if (isStartDate) {
            setStartDate(dateStr);
            setShowStartPicker(false);
        } else {
            setEndDate(dateStr);
            setShowEndPicker(false);
        }
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const validateDate = (dateString: string): boolean => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
    };

    const handleApply = () => {
        if (startDate && endDate && validateDate(startDate) && validateDate(endDate)) {
            onApply?.(startDate, endDate);
            close();
        }
    };

    return (
        <div className="bg-white rounded-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-5 border-b border-gray-100">
                <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg">
                        <img src={AppIcons.calendar} alt="" className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#0A0D14]">Date Range</h2>
                        <p className="text-sm text-[#667085] mt-1">Choose a date range to filter</p>
                    </div>
                </div>
                <button
                    onClick={close}
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <img src={AppIcons.x} alt="Close" className="w-5 h-5 cursor-pointer" />
                </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-5">
                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-[#344054] mb-2">
                        Start Date
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="YYYY-MM-DD"
                            value={startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            className="w-full rounded-xl border border-[#E8E8E8] bg-white px-3 py-2.5 pr-10 text-sm shadow-[0_1px_1px_rgba(0,0,0,0.03)] focus:border-[#EB003D] focus:outline-none placeholder:text-[#969696] placeholder:text-[13px] placeholder:font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setShowStartPicker(!showStartPicker);
                                setShowEndPicker(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <img
                                src={AppIcons.calendar}
                                alt="Select date"
                                className="w-4 h-4"
                            />
                        </button>
                    </div>

                    {/* Start Date Picker */}
                    {showStartPicker && (
                        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            {/* Month/Year Navigation */}
                            <div className="flex items-center justify-between mb-3 px-2">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                    type="button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M10 12L6 8L10 4" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <span className="text-sm font-semibold text-[#0A0D14]">
                                    {monthNames[currentMonth]} {currentYear}
                                </span>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                    type="button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 12L10 8L6 4" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-2 px-1">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-2 px-1">
                                {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }).map((_, index) => (
                                    <div key={`empty-${index}`} className="w-8 h-8" />
                                ))}
                                {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, index) => {
                                    const day = index + 1;
                                    const monthNum = String(currentMonth + 1).padStart(2, '0');
                                    const dayNum = String(day).padStart(2, '0');
                                    const dateStr = `${currentYear}-${monthNum}-${dayNum}`;
                                    const isSelected = startDate === dateStr;

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDateClick(day, true)}
                                            className={`w-8 h-8 flex items-center justify-center text-[13px] rounded-lg transition-colors ${
                                                isSelected
                                                    ? 'bg-rose-500 text-white font-medium hover:bg-rose-600'
                                                    : 'hover:bg-gray-100 text-[#344054] font-medium'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-[#344054] mb-2">
                        End Date
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="YYYY-MM-DD"
                            value={endDate}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            className="w-full rounded-xl border border-[#E8E8E8] bg-white px-3 py-2.5 pr-10 text-sm shadow-[0_1px_1px_rgba(0,0,0,0.03)] focus:border-[#EB003D] focus:outline-none placeholder:text-[#969696] placeholder:text-[13px] placeholder:font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setShowEndPicker(!showEndPicker);
                                setShowStartPicker(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <img
                                src={AppIcons.calendar}
                                alt="Select date"
                                className="w-4 h-4"
                            />
                        </button>
                    </div>

                    {/* End Date Picker */}
                    {showEndPicker && (
                        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            {/* Month/Year Navigation */}
                            <div className="flex items-center justify-between mb-3 px-2">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                    type="button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M10 12L6 8L10 4" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <span className="text-sm font-semibold text-[#0A0D14]">
                                    {monthNames[currentMonth]} {currentYear}
                                </span>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                    type="button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 12L10 8L6 4" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-2 px-1">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-2 px-1">
                                {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }).map((_, index) => (
                                    <div key={`empty-${index}`} className="w-8 h-8" />
                                ))}
                                {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, index) => {
                                    const day = index + 1;
                                    const monthNum = String(currentMonth + 1).padStart(2, '0');
                                    const dayNum = String(day).padStart(2, '0');
                                    const dateStr = `${currentYear}-${monthNum}-${dayNum}`;
                                    const isSelected = endDate === dateStr;

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDateClick(day, false)}
                                            className={`w-8 h-8 flex items-center justify-center text-[13px] rounded-lg transition-colors ${
                                                isSelected
                                                    ? 'bg-rose-500 text-white font-medium hover:bg-rose-600'
                                                    : 'hover:bg-gray-100 text-[#344054] font-medium'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>
                    Cancel
                </Button>
                <Button
                    onClick={handleApply}
                    disabled={!startDate || !endDate}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}
