import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProgressHeaderProps {
  mode: "batches" | "dialler";
  batchLabel?: string;
  batchCalled?: number;
  batchTotal?: number;
  todayCalls: number;
  dailyStreak: number;
  personalBest: { calls: number; date: string } | null;
  onBack?: () => void;
}

function formatPBDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDate();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${day} ${months[d.getMonth()]}`;
}

export default function ProgressHeader({
  mode,
  batchLabel,
  batchCalled = 0,
  batchTotal = 0,
  todayCalls,
  dailyStreak,
  personalBest,
  onBack,
}: ProgressHeaderProps) {
  // --- Batch list mode: daily summary ---
  if (mode === "batches") {
    return (
      <div className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50 px-4 py-3">
        <div className="flex items-center gap-4 pr-20">
          {/* Today's call count */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm text-zinc-500">Today:</span>
            <span className="text-2xl font-black tabular-nums text-white">
              {todayCalls}
            </span>
            <span className="text-sm text-zinc-500">
              call{todayCalls !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Streak */}
          {dailyStreak > 0 && (
            <span
              className={cn(
                "text-sm font-semibold tabular-nums flex items-center gap-1",
                dailyStreak >= 5 && "animate-pulse"
              )}
            >
              <span>🔥</span>
              <span className="text-orange-400">Day {dailyStreak}</span>
            </span>
          )}

          {/* Personal best */}
          {personalBest && (
            <span className="text-xs text-zinc-600 tabular-nums flex-shrink-0">
              PB: {personalBest.calls} ({formatPBDate(personalBest.date)})
            </span>
          )}
        </div>
      </div>
    );
  }

  // --- Dialler mode: batch progress ---
  const pct = batchTotal > 0 ? (batchCalled / batchTotal) * 100 : 0;

  return (
    <div className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        {/* Back + batch name */}
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Back to batches"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="font-bold text-white truncate text-[15px]">
            {batchLabel || "Batch"}
          </span>
        </div>

        {/* Batch progress + streak */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm tabular-nums">
            <span className="text-white font-bold">{batchCalled}</span>
            <span className="text-zinc-500">/{batchTotal}</span>
          </span>
          {dailyStreak > 0 && (
            <span
              className={cn(
                "text-sm font-medium tabular-nums flex items-center gap-1",
                dailyStreak >= 5 && "animate-pulse"
              )}
            >
              <span>🔥</span>
              <span className="text-orange-400">{dailyStreak}</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <Progress
        value={pct}
        className="h-2 bg-zinc-800 [&>div]:bg-green-500"
      />
    </div>
  );
}
