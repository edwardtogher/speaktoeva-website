import { ArrowLeft, Clock, LogOut } from "lucide-react";
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
      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] pt-[max(env(safe-area-inset-top),16px)] pb-2.5">
        {/* Top row: history (left) + logout (right) */}
        {(onHistory || onLogout) && (
          <div className="flex items-center justify-between px-3 pb-2">
            <div>
              {onHistory && (
                <button
                  onClick={onHistory}
                  className="bg-[#F2F2F7] rounded-full p-2.5 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors min-w-[44px] min-h-[44px]"
                  aria-label="Call history"
                >
                  <Clock className="w-5 h-5" />
                </button>
              )}
            </div>
            <div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-[#F2F2F7] rounded-full p-2.5 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors min-w-[44px] min-h-[44px]"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Compact stats row: call count left, streak + PB right */}
        <div className="flex items-center justify-between px-4">
          {/* Call count */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tabular-nums text-zinc-900 leading-none">
              {todayCalls}
            </span>
            <span className="text-sm text-zinc-500">
              call{todayCalls !== 1 ? "s" : ""} today
            </span>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1 bg-[#F2F2F7] rounded-full px-2.5 py-1",
                dailyStreak >= 5 && "animate-pulse"
              )}
            >
              <span className="text-xs">🔥</span>
              <span className={cn(
                "text-xs font-semibold tabular-nums",
                dailyStreak > 0 ? "text-orange-400" : "text-zinc-400"
              )}>
                {dailyStreak > 0 ? `${dailyStreak}d` : "0"}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#F2F2F7] rounded-full px-2.5 py-1">
              <span className="text-xs">🏆</span>
              <span className="text-xs font-semibold tabular-nums text-zinc-600">
                {personalBest ? `${personalBest.calls}` : "\u2014"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Dialler mode: batch progress ---
  const isGold = batchLabel === "Gold";
  const pct = batchTotal > 0 ? (batchCalled / batchTotal) * 100 : 0;

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
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
          <span className={cn(
            "font-bold truncate text-[15px]",
            isGold ? "text-amber-600 font-black" : "text-zinc-900"
          )}>
            {isGold ? "Gold" : (batchLabel || "Batch")}
          </span>
          {isGold && (
            <span className="text-base">&#x1F947;</span>
          )}
        </div>

        {/* Batch progress / Gold count + streak */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isGold ? (
            <span className="text-sm font-bold tabular-nums text-amber-600">
              {batchTotal} lead{batchTotal !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-sm tabular-nums">
              <span className="text-zinc-900 font-bold">{batchCalled}</span>
              <span className="text-zinc-400">/{batchTotal}</span>
            </span>
          )}
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
        value={isGold ? 100 : pct}
        className={cn(
          "h-2 bg-gray-200",
          isGold ? "[&>div]:bg-amber-500" : "[&>div]:bg-indigo-500"
        )}
      />
    </div>
  );
}
