import { Bell, ChevronDown } from 'lucide-react';
import { FormInput } from '../inputs/FormInput';
import { useSearchStore } from '@/features/shared-store/generalStore';

export const Topbar = () => {
    const { searchTerm, setSearchTerm, placeholder } = useSearchStore();
    return (
        <div className="h-16 lg:h-[72px] bg-white border-b border-gray-200 px-4 lg:px-8 flex items-center justify-between w-full">
            {/* Left Side: Search */}
            <div className="w-[60%] lg:w-[30%]">
                <FormInput
                    type="search"
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder={placeholder}
                />
            </div>

            {/* Right Side - Notification & Create Button */}
            <div className="flex items-center gap-2 lg:gap-6 ml-2 lg:ml-8">
                {/* Notification Button */}
                <button className="relative flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors p-2 lg:p-0 cursor-pointer">
                    <Bell className="w-5 lg:w-[20px] h-5 lg:h-[20px]" />
                    <span className="hidden md:inline text-[14px] font-medium">Notification</span>
                    <ChevronDown className="hidden md:inline w-[16px] h-[16px] text-gray-500" />

                    {/* Notification Badge */}
                    <span className="absolute top-0 lg:top-[-4px] right-0 lg:left-[10px] w-4 lg:w-[18px] h-4 lg:h-[18px] bg-[#ff0055] text-white text-[10px] lg:text-[11px] font-bold rounded-full flex items-center justify-center">
                        2
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Topbar;