import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
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
        "w-full min-h-[72px] rounded-2xl px-5 py-4 text-left transition-all shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:shadow-sm active:scale-[0.99]",
        isComplete
          ? "bg-indigo-50 border border-gray-100/50"
          : "bg-white border border-gray-100/50"
      )}
    >
      {/* Top row: emoji + label + progress fraction + chevron */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg flex-shrink-0">{emoji}</span>
          <span
            className={cn(
              "font-bold text-[15px] truncate",
              isComplete ? "text-zinc-400" : "text-zinc-900"
            )}
          >
            {batch.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span className="text-sm tabular-nums text-zinc-500">
            {stats.called}/{stats.total}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>
      </div>

      {/* Progress bar — thin */}
      <Progress
        value={pct}
        className={cn(
          "h-1.5 bg-gray-100 mb-2.5",
          isComplete
            ? "[&>div]:bg-indigo-500"
            : "[&>div]:bg-indigo-500"
        )}
      />

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs">
        {isComplete ? (
          <span className="text-indigo-600 font-semibold">Complete ✓</span>
        ) : (
          <>
            {stats.interested > 0 && (
              <span className="text-orange-500 font-medium tabular-nums">
                {stats.interested} 🔥
              </span>
            )}
            {stats.followUps > 0 && (
              <span className="text-amber-500 font-medium tabular-nums">
                {stats.followUps} follow-up{stats.followUps !== 1 ? "s" : ""}
              </span>
            )}
            {stats.exhausted > 0 && (
              <span className="text-zinc-400 font-medium tabular-nums">
                {stats.exhausted} exhausted
              </span>
            )}
            {stats.called > 0 && (
              <span className="text-zinc-400 tabular-nums">
                {stats.called} called
              </span>
            )}
            {stats.interested === 0 && stats.followUps === 0 && stats.called === 0 && (
              <span className="text-zinc-400">Not started</span>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
}
