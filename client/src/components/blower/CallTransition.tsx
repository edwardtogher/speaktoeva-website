import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Square, Sparkles } from "lucide-react";
import type { Disposition } from "@/hooks/use-blower-store";

interface CallTransitionProps {
  disposition: Disposition;
  leadName?: string;
  nextLeadName?: string;
  nextLeadBusiness?: string;
  todayCalls: number;
  batchComplete?: boolean;
  onContinue: () => void;
  onStop: () => void;
}

const TRANSITION_MS = 1500;

function getMessage(disposition: Disposition, leadName: string | undefined, todayCalls: number): string {
  switch (disposition) {
    case "no_answer":
      return `Onto the next one! That's ${todayCalls} call${todayCalls !== 1 ? "s" : ""} today.`;
    case "interested":
      return `Nice one! ${leadName || "They"}'re interested!`;
    case "not_interested":
      return `Good info - moving on. ${todayCalls} call${todayCalls !== 1 ? "s" : ""} down today.`;
    default:
      return `${todayCalls} calls today. Keep going!`;
  }
}

function getCardStyle(disposition: Disposition): { bg: string; border: string } {
  switch (disposition) {
    case "no_answer":
      return { bg: "bg-slate-50", border: "border-slate-200" };
    case "interested":
      return { bg: "bg-green-50", border: "border-green-200" };
    case "not_interested":
      return { bg: "bg-gray-50", border: "border-gray-200" };
    default:
      return { bg: "bg-white", border: "border-gray-200" };
  }
}

export default function CallTransition({
  disposition,
  leadName,
  nextLeadName,
  nextLeadBusiness,
  todayCalls,
  batchComplete,
  onContinue,
  onStop,
}: CallTransitionProps) {
  // Auto-advance after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [onContinue]);

  const handleStop = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onStop();
    },
    [onStop]
  );

  const message = getMessage(disposition, leadName, todayCalls);
  const style = getCardStyle(disposition);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -10 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className={`mx-6 w-full max-w-sm rounded-2xl ${style.bg} border ${style.border} shadow-lg overflow-hidden`}
      >
        {/* Outcome message */}
        <div className="px-6 pt-6 pb-4 text-center">
          {disposition === "interested" && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.3, 1], rotate: [-10, 5, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex justify-center mb-3"
            >
              <Sparkles className="w-10 h-10 text-green-500" />
            </motion.div>
          )}

          <p className="text-[17px] font-bold text-zinc-900 leading-snug">
            {message}
          </p>
        </div>

        {/* Next lead preview or batch complete */}
        {batchComplete ? (
          <div className="px-6 pb-4 text-center">
            <p className="text-sm font-semibold text-indigo-600">
              Batch complete!
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Returning to the list...
            </p>
          </div>
        ) : nextLeadName ? (
          <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-white/80 border border-gray-100">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-700 truncate">
                  {nextLeadName}
                </p>
                {nextLeadBusiness && (
                  <p className="text-xs text-zinc-400 truncate">
                    {nextLeadBusiness}
                  </p>
                )}
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5 text-center">
              Calling next...
            </p>
          </div>
        ) : null}

        {/* Progress bar */}
        <div className="px-6 pb-2">
          <div className="h-1 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: TRANSITION_MS / 1000, ease: "linear" }}
              className={
                disposition === "interested"
                  ? "h-full bg-green-500 rounded-full"
                  : "h-full bg-indigo-500 rounded-full"
              }
            />
          </div>
        </div>

        {/* Stop button */}
        <div className="px-6 pb-5 pt-2 flex justify-center">
          <button
            onClick={handleStop}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-zinc-400 text-[13px] font-medium hover:text-zinc-600 hover:bg-gray-100 transition-colors"
          >
            <Square className="w-3.5 h-3.5" />
            Stop Calling
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
