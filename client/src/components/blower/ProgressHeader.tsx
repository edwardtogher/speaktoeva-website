import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProgressHeaderProps {
  stats: {
    total: number;
    completed: number;
    streak: number;
    round: number;
  };
}

export default function ProgressHeader({ stats }: ProgressHeaderProps) {
  const pct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        {/* Counter */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums text-white">
            {stats.completed}
          </span>
          <span className="text-lg text-zinc-500 tabular-nums">
            /{stats.total}
          </span>
        </div>

        {/* Streak + Round */}
        <div className="flex items-center gap-3">
          {stats.streak > 0 && (
            <span
              className={cn(
                "text-sm font-medium tabular-nums flex items-center gap-1",
                stats.streak > 5 && "animate-pulse"
              )}
            >
              <span role="img" aria-label="streak">🔥</span>
              <span className="text-orange-400">{stats.streak}</span>
            </span>
          )}
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {stats.round === 1 ? "Round 1" : "Round 2 - Retries"}
          </span>
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
