import { ArrowLeft, History, LogOut } from "lucide-react";
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
  onHistory?: () => void;
  onLogout?: () => void;
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
  onHistory,
  onLogout,
}: ProgressHeaderProps) {
  // --- Batch list mode: daily summary ---
  if (mode === "batches") {
    return (
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 pt-[max(env(safe-area-inset-top),12px)] pb-4">
        {/* Top row: history + logout */}
        {(onHistory || onLogout) && (
          <div className="flex items-center justify-end gap-1 px-3 pb-1">
            {onHistory && (
              <button
                onClick={onHistory}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Call history"
              >
                <History className="w-4 h-4" />
              </button>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Big centered call count */}
        <div className="flex flex-col items-center pb-3">
          <span className="text-6xl font-black tabular-nums text-zinc-900 leading-none">
            {todayCalls}
          </span>
          <span className="text-sm text-zinc-500 mt-1">
            call{todayCalls !== 1 ? "s" : ""} today
          </span>
        </div>

        {/* Stats pills row */}
        <div className="flex items-center justify-center gap-3 px-4">
          <div
            className={cn(
              "flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5",
              dailyStreak >= 5 && "animate-pulse"
            )}
          >
            <span className="text-sm">🔥</span>
            <span className={cn(
              "text-sm font-semibold tabular-nums",
              dailyStreak > 0 ? "text-orange-400" : "text-zinc-400"
            )}>
              {dailyStreak > 0 ? `Day ${dailyStreak}` : "No streak"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5">
            <span className="text-sm">🏆</span>
            <span className="text-sm font-semibold tabular-nums text-zinc-600">
              {personalBest ? `${personalBest.calls}` : "\u2014"}
            </span>
            {personalBest && (
              <span className="text-xs text-zinc-400">
                {formatPBDate(personalBest.date)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Dialler mode: batch progress ---
  const pct = batchTotal > 0 ? (batchCalled / batchTotal) * 100 : 0;

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
      <div className="flex items-center justify-between mb-2">
        {/* Back + batch name */}
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Back to batches"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="font-bold text-zinc-900 truncate text-[15px]">
            {batchLabel || "Batch"}
          </span>
        </div>

        {/* Batch progress + streak */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm tabular-nums">
            <span className="text-zinc-900 font-bold">{batchCalled}</span>
            <span className="text-zinc-400">/{batchTotal}</span>
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
        className="h-2 bg-gray-200 [&>div]:bg-indigo-500"
      />
    </div>
  );
}
