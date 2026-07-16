import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Portal } from "@/components/common/Portal";

export type AnalyticsTab = {
  key: string;
  label: string;
};

type Props<T extends string> = {
  tabs: AnalyticsTab[];
  active: T;
  onChange: (key: T) => void;
};

export function AnalyticsTabs<T extends string>({ tabs, active, onChange }: Props<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => setIsOverflowing(el.scrollWidth > el.clientWidth + 1);
    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [tabs]);

  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [active]);

  useLayoutEffect(() => {
    if (menuOpen && moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        zIndex: 10000,
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (moreButtonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="relative flex items-stretch border-b border-t border-[#E8E8E8] bg-white">
      <div ref={scrollRef} className="no-scrollbar flex flex-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              onClick={() => onChange(tab.key as T)}
              className={`relative shrink-0 px-6 py-4 text-[13px] font-normal whitespace-nowrap transition-colors cursor-pointer ${isActive ? "text-[#FF2860]" : "text-[#666] hover:text-[#0A0D14]"
                }`}
            >
              {tab.label}
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF2860]" />}
            </button>
          );
        })}
      </div>

      {isOverflowing && (
        <button
          ref={moreButtonRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex shrink-0 cursor-pointer items-center gap-1 border-l border-[#E8E8E8] bg-white px-4 py-4 text-[13px] font-medium text-[#666] transition-colors hover:text-[#0A0D14]"
        >
          More
          <ChevronDown size={14} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {menuOpen && (
        <Portal>
          <div ref={menuRef} style={menuStyle} className="w-56 rounded-xl border border-[#EFEFF3] bg-white p-2 shadow-xl">
            {tabs.map((tab) => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    onChange(tab.key as T);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${isActive ? "bg-[#FFF0F4] text-[#FF2860]" : "text-[#344054] hover:bg-gray-50"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
}
