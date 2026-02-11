import { cn } from "@/lib/utils";
import type { FilterKey } from "@/hooks/use-blower-store";

interface FilterBarProps {
  activeFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  counts: Record<FilterKey, number>;
  batchId?: string;
  exhaustedCount?: number;
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "new", label: "New" },
  { key: "follow_ups", label: "Follow-ups" },
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  counts,
  exhaustedCount = 0,
}: FilterBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-3 py-2">
      <div className="flex gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px]",
              activeFilter === key
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-zinc-500 active:bg-gray-200"
            )}
          >
            {label}
            <span
              className={cn(
                "text-xs tabular-nums px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                activeFilter === key
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-zinc-400"
              )}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Exhausted note */}
      {exhaustedCount > 0 && (
        <p className="text-[11px] text-zinc-400 text-center mt-1.5 tabular-nums">
          {exhaustedCount} exhausted (5+ attempts)
        </p>
      )}
    </div>
  );
}
