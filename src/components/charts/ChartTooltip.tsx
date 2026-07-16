export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string | number;
  payload?: readonly unknown[];
}) {
  if (!active || !payload?.length) return null;
  const entries = payload as { dataKey?: string | number; value?: number }[];
  return (
    <div
      className="relative cursor-pointer"
      style={{ transform: "translate(-50%, calc(-100% - 10px))" }}
    >
      <div className="rounded-xl border border-[#EFEFF3] bg-white px-4 py-3 shadow-lg">
        <p className="text-[13px] font-semibold text-[#0A0D14]">{label}</p>
        {entries.map((entry) => (
          <p key={entry.dataKey} className="text-[13px] text-[#666]">
            {(entry.value ?? 0).toLocaleString()}
          </p>
        ))}
      </div>
      {/* arrow border */}
      <span className="absolute left-1/2 -bottom-[7px] h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[7px] border-x-transparent border-t-[#EFEFF3]" />
      {/* arrow fill */}
      <span className="absolute left-1/2 -bottom-[6px] h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-white" />
    </div>
  );
}
