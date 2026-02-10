import { cn } from "@/lib/utils";
import type { FilterKey } from "@/hooks/use-blower-store";

interface FilterBarProps {
  activeFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  counts: Record<FilterKey, number>;
}

const FILTERS: { key: FilterKey; label: string; emptyLabel?: string }[] = [
  { key: "new", label: "New" },
  { key: "follow_ups", label: "Follow-ups" },
  { key: "wins", label: "Wins" },
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  counts,
}: FilterBarProps) {
  return (
    <div className="bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/30 px-3 py-2">
      <div className="flex gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[40px]",
              activeFilter === key
                ? "bg-zinc-100 text-zinc-900"
                : "bg-zinc-800/50 text-zinc-400 active:bg-zinc-800"
            )}
          >
            {label}
            <span
              className={cn(
                "text-xs tabular-nums px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                activeFilter === key
                  ? "bg-zinc-900/15 text-zinc-700"
                  : "bg-zinc-700/50 text-zinc-500"
              )}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
