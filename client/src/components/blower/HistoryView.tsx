import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CallLogEntry, Disposition } from "@/hooks/use-blower-store";
import { LEADS } from "@/config/blower-leads";

interface DayStats {
  date: string;
  calls: number;
  noAnswer: number;
  interested: number;
  notInterested: number;
  firstCallAt: number | null;
  lastCallAt: number | null;
}

interface HistoryViewProps {
  dailyStats: Record<string, DayStats>;
  dailyStreak: number;
  callLog: CallLogEntry[];
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10);
  if (dateStr === today) return "Today";

  const d = new Date(dateStr + "T12:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatTime(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${m}${ampm}`;
}

function dispositionDotColor(d: Disposition): string {
  switch (d) {
    case "interested": return "bg-green-500";
    case "not_interested": return "bg-red-400";
    case "no_answer": return "bg-zinc-300";
  }
}

function getLeadName(leadId: string): string {
  const lead = LEADS.find((l) => l.id === leadId);
  return lead ? lead.name : leadId;
}

export default function HistoryView({
  dailyStats,
  dailyStreak,
  callLog,
  onBack,
}: HistoryViewProps) {
  // Sort days newest first
  const days = Object.entries(dailyStats)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, stats]) => stats);

  // Swipe-back gesture
  const [swipeX, setSwipeX] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX <= 50) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      isSwipingRef.current = false;
    } else {
      touchStartRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    if (dx > 10 && dx > dy) {
      isSwipingRef.current = true;
      setSwipeX(Math.min(dx, 300));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    touchStartRef.current = null;
    if (isSwipingRef.current && swipeX > 100) {
      setSwipeX(400);
      setTimeout(onBack, 150);
    } else {
      setSwipeX(0);
    }
    isSwipingRef.current = false;
  }, [swipeX, onBack]);

  return (
    <div
      className="min-h-[100dvh] bg-[#F2F2F7] text-zinc-900 flex flex-col"
      style={{
        fontFamily: "'Inter', sans-serif",
        transform: swipeX > 0 ? `translateX(${swipeX}px)` : undefined,
        transition: isSwipingRef.current ? "none" : "transform 0.2s ease-out",
        opacity: swipeX > 0 ? 1 - swipeX / 500 : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-zinc-900">Call History</h1>
        </div>

        {/* Streak banner */}
        {dailyStreak > 0 && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-500 font-semibold">
                🔥 Current streak: {dailyStreak} day{dailyStreak !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Day list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {days.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-zinc-400 text-lg">No calls yet</p>
          </div>
        ) : (
          days.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-gray-100/50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-3.5"
            >
              {/* Date */}
              <p
                className={cn(
                  "font-bold text-[15px] mb-1.5",
                  day.date === new Date().toISOString().slice(0, 10)
                    ? "text-indigo-600"
                    : "text-zinc-900"
                )}
              >
                {formatDate(day.date)}
              </p>

              {/* Stats line */}
              <p className="text-sm text-zinc-500 leading-relaxed">
                <span className="text-zinc-900 font-semibold tabular-nums">
                  {day.calls}
                </span>{" "}
                call{day.calls !== 1 ? "s" : ""}
                {day.interested > 0 && (
                  <>
                    {" "}&middot;{" "}
                    <span className="text-green-600 tabular-nums">
                      {day.interested} interested
                    </span>
                  </>
                )}
                {day.noAnswer > 0 && (
                  <>
                    {" "}&middot;{" "}
                    <span className="tabular-nums">{day.noAnswer} no answer</span>
                  </>
                )}
                {day.notInterested > 0 && (
                  <>
                    {" "}&middot;{" "}
                    <span className="tabular-nums">
                      {day.notInterested} not interested
                    </span>
                  </>
                )}
              </p>

              {/* Active time */}
              {day.firstCallAt && day.lastCallAt && (
                <p className="text-xs text-zinc-400 mt-1">
                  Active: {formatTime(day.firstCallAt)} &ndash;{" "}
                  {formatTime(day.lastCallAt)}
                </p>
              )}

              {/* Individual calls */}
              {(() => {
                const dayCalls = callLog
                  .filter(
                    (entry) =>
                      new Date(entry.timestamp).toISOString().slice(0, 10) ===
                      day.date
                  )
                  .sort((a, b) => b.timestamp - a.timestamp);
                if (dayCalls.length === 0) return null;
                return (
                  <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
                    {dayCalls.map((entry, j) => (
                      <div
                        key={`${entry.leadId}-${entry.timestamp}-${j}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            dispositionDotColor(entry.disposition)
                          )}
                        />
                        <span className="text-xs text-zinc-400 tabular-nums w-[52px] flex-shrink-0">
                          {formatTime(entry.timestamp)}
                        </span>
                        <span className="text-sm text-zinc-700 truncate">
                          {getLeadName(entry.leadId)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
