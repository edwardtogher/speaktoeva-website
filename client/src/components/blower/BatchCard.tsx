import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface BatchStats {
  total: number;
  called: number;
  noAnswer: number;
  interested: number;
  notInterested: number;
  followUps: number;
  exhausted: number;
}

interface BatchCardProps {
  batch: { id: string; label: string; count: number };
  stats: BatchStats;
  onTap: () => void;
}

const BATCH_EMOJI: Record<string, string> = {
  "farnham-mobiles": "\u{1F4F1}",
  "farnham-landlines": "\u{1F4DE}",
  "wider-surrey": "\u{1F4CD}",
  "indeed-hiring": "\u{1F4BC}",
  "running-ads": "\u{1F4E3}",
};

export default function BatchCard({ batch, stats, onTap }: BatchCardProps) {
  const pct = stats.total > 0 ? (stats.called / stats.total) * 100 : 0;
  const isComplete = stats.called >= stats.total && stats.total > 0;
  const emoji = BATCH_EMOJI[batch.id] || "\u{1F4CB}";

  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full min-h-[72px] rounded-xl border px-4 py-3.5 text-left transition-colors",
        isComplete
          ? "bg-zinc-900/40 border-green-800/30"
          : "bg-zinc-900 border-zinc-800 active:bg-zinc-800/80"
      )}
    >
      {/* Top row: emoji + label + progress fraction */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg flex-shrink-0">{emoji}</span>
          <span
            className={cn(
              "font-bold text-[15px] truncate",
              isComplete ? "text-zinc-500" : "text-white"
            )}
          >
            {batch.label}
          </span>
        </div>
        <span className="text-sm tabular-nums text-zinc-400 flex-shrink-0 ml-2">
          {stats.called}/{stats.total}
        </span>
      </div>

      {/* Progress bar — thin */}
      <Progress
        value={pct}
        className={cn(
          "h-1.5 bg-zinc-800 mb-2.5",
          isComplete
            ? "[&>div]:bg-green-500"
            : "[&>div]:bg-green-500"
        )}
      />

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs">
        {isComplete ? (
          <span className="text-green-400 font-semibold">Complete ✓</span>
        ) : (
          <>
            {stats.interested > 0 && (
              <span className="text-orange-400 font-medium tabular-nums">
                {stats.interested} 🔥
              </span>
            )}
            {stats.followUps > 0 && (
              <span className="text-amber-400/80 font-medium tabular-nums">
                {stats.followUps} follow-up{stats.followUps !== 1 ? "s" : ""}
              </span>
            )}
            {stats.exhausted > 0 && (
              <span className="text-zinc-600 font-medium tabular-nums">
                {stats.exhausted} exhausted
              </span>
            )}
            {stats.called > 0 && (
              <span className="text-zinc-500 tabular-nums">
                {stats.called} called
              </span>
            )}
            {stats.interested === 0 && stats.followUps === 0 && stats.called === 0 && (
              <span className="text-zinc-600">Not started</span>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
}
