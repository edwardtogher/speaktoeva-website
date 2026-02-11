import { motion } from "framer-motion";
import { useLeaderboard, type LeaderboardEntry } from "@/hooks/use-blower-api";
import { cn } from "@/lib/utils";

function formatPBDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDate();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${day} ${months[d.getMonth()]}`;
}

function getDayLabels(): string[] {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date().getDay(); // 0 = Sunday
  const result: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayIndex = (today - i + 7) % 7;
    result.push(labels[dayIndex]);
  }
  return result;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-black text-lg">1</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-zinc-300 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-black text-lg">2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-black text-lg">3</span>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
      <span className="text-zinc-500 font-bold text-lg">{rank}</span>
    </div>
  );
}

function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const dayLabels = getDayLabels();

  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((value, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className="w-3 rounded-sm bg-indigo-600"
            style={{
              height: `${Math.max((value / max) * 28, 2)}px`,
              opacity: value === 0 ? 0.15 : 1,
            }}
          />
          <span className="text-[9px] text-zinc-400 leading-none">
            {dayLabels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function UserCard({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const isFirst = rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: (rank - 1) * 0.05 }}
      className={cn(
        "bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-3",
        isFirst && "border-2 border-amber-400 shadow-[0_2px_12px_rgba(245,158,11,0.15)]"
      )}
    >
      {/* Top row: rank + name + today calls */}
      <div className="flex items-center gap-3">
        <RankBadge rank={rank} />
        <div className="flex-1 min-w-0">
          <span className="text-[17px] font-bold text-zinc-900 truncate block">
            {capitalize(entry.username)}
          </span>
          <span className="text-xs text-zinc-400">
            {entry.totalCalls} all-time call{entry.totalCalls !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-3xl font-black tabular-nums text-zinc-900 leading-none">
            {entry.todayCalls}
          </span>
          <span className="block text-[11px] text-zinc-400 mt-0.5">today</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {/* Win rate */}
        <div className="flex items-center gap-1 bg-[#F2F2F7] rounded-full px-2.5 py-1">
          <span className="text-xs font-semibold text-emerald-600 tabular-nums">
            {entry.winRate}%
          </span>
          <span className="text-[10px] text-zinc-400">win</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 bg-[#F2F2F7] rounded-full px-2.5 py-1">
          <span className="text-xs">&#x1F525;</span>
          <span
            className={cn(
              "text-xs font-semibold tabular-nums",
              entry.currentStreak > 0 ? "text-orange-400" : "text-zinc-400"
            )}
          >
            {entry.currentStreak > 0 ? `Day ${entry.currentStreak}` : "No streak"}
          </span>
        </div>

        {/* Personal best */}
        <div className="flex items-center gap-1 bg-[#F2F2F7] rounded-full px-2.5 py-1">
          <span className="text-xs">&#x1F3C6;</span>
          <span className="text-xs font-semibold tabular-nums text-zinc-600">
            {entry.personalBest ? entry.personalBest.calls : "\u2014"}
          </span>
          {entry.personalBest && (
            <span className="text-[10px] text-zinc-400">
              {formatPBDate(entry.personalBest.date)}
            </span>
          )}
        </div>
      </div>

      {/* 7-day chart */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">
          Last 7 days
        </span>
        <MiniBarChart data={entry.last7Days} />
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-200 rounded w-24" />
          <div className="h-3 bg-zinc-100 rounded w-16" />
        </div>
        <div className="text-right space-y-1">
          <div className="h-8 bg-zinc-200 rounded w-10 ml-auto" />
          <div className="h-2 bg-zinc-100 rounded w-8 ml-auto" />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="h-6 bg-zinc-100 rounded-full w-16" />
        <div className="h-6 bg-zinc-100 rounded-full w-20" />
        <div className="h-6 bg-zinc-100 rounded-full w-16" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="h-2 bg-zinc-100 rounded w-14" />
        <div className="flex items-end gap-1 h-10">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-3 rounded-sm bg-zinc-200" style={{ height: `${8 + Math.random() * 20}px` }} />
              <div className="w-2 h-1.5 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardView() {
  const { data, isLoading, isError, refetch } = useLeaderboard();

  // Loading
  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-3">
        <h2 className="text-xl font-bold text-zinc-900">Leaderboard</h2>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="px-4 py-3 space-y-3">
        <h2 className="text-xl font-bold text-zinc-900">Leaderboard</h2>
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-8 flex flex-col items-center gap-3">
          <p className="text-zinc-500 text-sm">Couldn't load leaderboard</p>
          <button
            onClick={() => refetch()}
            className="bg-indigo-600 text-white rounded-full px-5 py-2 text-sm font-semibold min-h-[44px] active:scale-95 transition-transform"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty
  if (!data || data.length === 0) {
    return (
      <div className="px-4 py-3 space-y-3">
        <h2 className="text-xl font-bold text-zinc-900">Leaderboard</h2>
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-12 flex items-center justify-center">
          <p className="text-zinc-400 text-sm text-center">
            No data yet — start calling to appear on the leaderboard!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-3">
      <h2 className="text-xl font-bold text-zinc-900">Leaderboard</h2>
      {data.map((entry, i) => (
        <UserCard key={entry.userId} entry={entry} rank={i + 1} />
      ))}
    </div>
  );
}
