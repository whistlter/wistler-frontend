import { useEffect, useState } from 'react';
import { AppIcons } from "@/constants/constant";

export function MobileRestriction() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="flex items-center  mb-4">
                <div className=" h-10 sm:w-12 sm:h-12  rounded-full flex items-center justify-center">
                    <img
                        src={AppIcons.logoW}
                        alt="Whistler Logo"
                        className="w-6 h-12 sm:w-7 sm:h-12"
                    />
                </div>
                <span className="text-xl font-bold text-[#1A1A1A]">histler Admin</span>
            </div>

            <h1 className="text-xl font-bold text-[#1A1A1A] mb-3">
                Desktop or Tablet Custom Experience
            </h1>

            <p className="text-[#666666] max-w-md mx-auto leading-relaxed">
                Please use a tablet or PC to access the site.
                Mobile devices are not supported at this time to ensure the best administration experience.
            </p>
        </div>
    );
}
