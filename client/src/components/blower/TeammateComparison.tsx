import { useLeaderboard } from "@/hooks/use-blower-api";
import { BLOWER_USERS } from "@/config/blower-users";
import { cn } from "@/lib/utils";

interface TeammateComparisonProps {
  username: string;
  todayCalls: number;
}

export default function TeammateComparison({ username, todayCalls }: TeammateComparisonProps) {
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading || !leaderboard || leaderboard.length < 2) return null;

  // Find display name for the current user
  const currentUser = BLOWER_USERS.find((u) => u.username === username);
  const myDisplayName = currentUser?.displayName ?? username;

  // Find teammate entries (everyone except current user)
  const teammates = leaderboard.filter(
    (e) => e.username !== username && e.userId !== username
  );

  if (teammates.length === 0) return null;

  // Pick the top teammate
  const top = teammates.reduce((a, b) =>
    b.todayCalls > a.todayCalls ? b : a
  );

  const teammateName =
    BLOWER_USERS.find((u) => u.username === top.username || u.username === top.userId)
      ?.displayName ?? top.username;

  const diff = todayCalls - top.todayCalls;

  let text: string;
  let colorClass: string;

  if (diff > 0) {
    text = `You: ${todayCalls} | ${teammateName}: ${top.todayCalls}`;
    colorClass = "text-emerald-600";
  } else if (diff === 0) {
    text = `You: ${todayCalls} | ${teammateName}: ${top.todayCalls} -- tied!`;
    colorClass = "text-zinc-500";
  } else {
    const behind = Math.abs(diff);
    text = `${teammateName}: ${top.todayCalls} -- ${behind} ahead of you!`;
    colorClass = "text-orange-500";
  }

  return (
    <div className={cn("text-xs font-semibold tabular-nums", colorClass)}>
      {text}
    </div>
  );
}
