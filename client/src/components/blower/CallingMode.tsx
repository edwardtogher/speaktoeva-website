import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PhoneMissed, ThumbsUp, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lead } from "@/config/blower-leads";
import type { Disposition } from "@/hooks/use-blower-store";
import {
  ScriptOpening,
  ScriptGatekeeper,
  ScriptGoldCallbackOpening,
  ScriptPitch,
  ScriptDemoClose,
  ScriptClose,
  ScriptObjections,
  ScriptStats,
} from "@/config/blower-scripts";

// --- Types ---

interface CallingModeProps {
  lead: Lead;
  batchId?: string;
  attempts: number;
  existingNote: string;
  existingTags: string[];
  onComplete: (disposition: Disposition, note: string, tags: string[]) => void;
  onBack: () => void;
}

// --- Constants ---

const TYPE_LABEL: Record<Lead["type"], string> = {
  physio: "Physio",
  chiro: "Chiro",
  osteo: "Osteo",
  multi: "Multi",
  wellness: "Wellness",
};

const TYPE_COLOR: Record<Lead["type"], string> = {
  physio: "bg-blue-100 text-blue-700 border-blue-200",
  chiro: "bg-purple-100 text-purple-700 border-purple-200",
  osteo: "bg-amber-100 text-amber-700 border-amber-200",
  multi: "bg-teal-100 text-teal-700 border-teal-200",
  wellness: "bg-pink-100 text-pink-700 border-pink-200",
};

const SIGNAL_LABEL: Record<string, string> = {
  hiring: "Hiring",
  ads: "Running Ads",
  local: "Local",
  "hiring+local": "Hiring + Local",
  "ads+local": "Ads + Local",
};

const SIGNAL_COLOR: Record<string, string> = {
  hiring: "bg-orange-100 text-orange-700 border-orange-200",
  ads: "bg-emerald-100 text-emerald-700 border-emerald-200",
  local: "bg-gray-100 text-zinc-600 border-gray-200",
  "hiring+local": "bg-orange-100 text-orange-700 border-orange-200",
  "ads+local": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// --- Script helpers (reuses ScriptDrawer logic) ---

function getOpening(batchId?: string): { location: string; caseStudy: string } {
  switch (batchId) {
    case "farnham-mobiles":
    case "farnham-landlines":
      return {
        location: "I'm based in Farnham",
        caseStudy:
          "We've been doing some work with a business up near Weydon School, if you know where that is",
      };
    case "wider-surrey":
      return {
        location: "I'm based in Surrey",
        caseStudy: "We've been doing some work with a clinic over in Farnham",
      };
    case "indeed-hiring":
    case "running-ads":
    default:
      return {
        location: "I'm based in Surrey",
        caseStudy: "We've been doing some work with an osteo clinic in London",
      };
  }
}

function getCallbackPhrase(attempts: number): string {
  return attempts <= 2 ? "the other day" : "a couple of times";
}

// --- Component ---

export default function CallingMode({
  lead,
  batchId,
  attempts,
  existingNote,
  existingTags,
  onComplete,
  onBack,
}: CallingModeProps) {
  const [note, setNote] = useState(existingNote);
  const noteRef = useRef(note);

  const { location, caseStudy } = getOpening(batchId);
  const isCallback = attempts > 0;

  const showSignal = lead.signal !== "local";

  // Debounced note save (updates ref immediately, no external save until disposition)
  const handleNoteChange = useCallback((value: string) => {
    setNote(value);
    noteRef.current = value;
  }, []);

  // Handle disposition tap
  const handleDisposition = useCallback(
    (disposition: Disposition) => {
      onComplete(disposition, noteRef.current, existingTags);
    },
    [onComplete, existingTags]
  );

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-[#F2F2F7] text-zinc-900 flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ===== STICKY HEADER ===== */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
        {/* Back + Lead name row */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-gray-100 transition-colors -ml-2"
            aria-label="Exit calling mode"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate text-zinc-900">{lead.name}</h1>
            <p className="text-sm text-zinc-500 truncate">{lead.town}</p>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              TYPE_COLOR[lead.type]
            )}
          >
            {TYPE_LABEL[lead.type]}
          </span>
          {showSignal && (
            <span
              className={cn(
                "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
                SIGNAL_COLOR[lead.signal] || "bg-zinc-700/40 text-zinc-400 border-zinc-600/30"
              )}
            >
              {SIGNAL_LABEL[lead.signal] || lead.signal}
            </span>
          )}
          {isCallback && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-amber-100 text-amber-700 border-amber-200">
              Gold x{attempts}
            </span>
          )}
        </div>
      </div>

      {/* ===== STICKY NOTES ===== */}
      <div className="sticky top-[auto] z-10 bg-white/90 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3">
        {/* Notes input */}
        <input
          type="text"
          value={note}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Quick note..."
          className="w-full h-[44px] px-3 rounded-xl bg-white border border-gray-200 text-zinc-900 text-[16px] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-transparent"
        />
      </div>

      {/* ===== SCROLLABLE SCRIPT (PLAIN TEXT CARDS) ===== */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[140px] space-y-3">
        {/* 1. Opening — different script for follow-up (Gold) leads */}
        {isCallback ? (
          <div className="rounded-2xl bg-amber-50 border border-amber-300/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="px-4 py-3 flex items-center gap-2">
              <span className="text-[13px] font-bold text-amber-700 tabular-nums">1</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Follow-Up Opening
              </span>
            </div>
            <div className="px-4 pb-4">
              <ScriptGoldCallbackOpening />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-blue-50 border border-blue-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="px-4 py-3 flex items-center gap-2">
              <span className="text-[13px] font-bold text-blue-700 tabular-nums">1</span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Opening
              </span>
            </div>
            <div className="px-4 pb-4">
              <ScriptOpening />
            </div>
          </div>
        )}

        {/* 2. Gatekeeper — skip for callback leads */}
        {!isCallback && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="px-4 py-3 flex items-center gap-2">
              <span className="text-[13px] font-bold text-amber-700 tabular-nums">2</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Gatekeeper
              </span>
              <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                IF NEEDED
              </span>
            </div>
            <div className="px-4 pb-4">
              <ScriptGatekeeper />
            </div>
          </div>
        )}

        {/* 3. Pitch */}
        <div className="rounded-2xl bg-purple-50 border border-purple-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-3 flex items-center gap-2">
            <span className="text-[13px] font-bold text-purple-700 tabular-nums">{isCallback ? 2 : 3}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Pitch
            </span>
          </div>
          <div className="px-4 pb-4">
            <ScriptPitch location={location} caseStudy={caseStudy} />
          </div>
        </div>

        {/* Demo Close */}
        <div className="rounded-2xl bg-green-50 border border-green-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-3 flex items-center gap-2">
            <span className="text-[13px] font-bold text-green-700 tabular-nums">{isCallback ? 3 : 4}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-green-700">Demo Close</span>
          </div>
          <div className="px-4 pb-4"><ScriptDemoClose /></div>
        </div>

        {/* Close */}
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-3 flex items-center gap-2">
            <span className="text-[13px] font-bold text-emerald-700 tabular-nums">{isCallback ? 4 : 5}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Close</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded font-medium">IF YES</span>
          </div>
          <div className="px-4 pb-4"><ScriptClose /></div>
        </div>

        {/* Objections */}
        <div className="rounded-2xl bg-white border border-gray-100/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-3 flex items-center gap-2">
            <span className="text-[13px] font-bold text-red-600 tabular-nums">{isCallback ? 5 : 6}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">Objections</span>
          </div>
          <div className="px-4 pb-4"><ScriptObjections /></div>
        </div>

        {/* Stats to Drop */}
        <div className="rounded-2xl bg-gray-50 border border-gray-100/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-3 flex items-center gap-2">
            <span className="text-[13px] font-bold text-zinc-500 tabular-nums">{isCallback ? 6 : 7}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stats to Drop</span>
          </div>
          <div className="px-4 pb-4"><ScriptStats />
          </div>
        </div>
      </div>

      {/* ===== STICKY DISPOSITION BAR (BOTTOM) ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-[0_-2px_8px_rgba(0,0,0,0.06)] px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
        <div className="flex gap-2">
          {/* No Answer */}
          <button
            onClick={() => handleDisposition("no_answer")}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-xl bg-gray-100 border border-gray-200 text-zinc-700 font-bold text-[15px] transition-all active:scale-[0.97] active:bg-gray-200"
          >
            <PhoneMissed className="w-5 h-5" />
            No Answer
          </button>

          {/* Interested */}
          <button
            onClick={() => handleDisposition("interested")}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-xl bg-green-600 text-white font-bold text-[15px] shadow-md transition-all active:scale-[0.97] active:bg-green-700"
          >
            <ThumbsUp className="w-5 h-5" />
            Interested
          </button>

          {/* Not Interested (reframed as "Next") */}
          <button
            onClick={() => handleDisposition("not_interested")}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-xl bg-zinc-200 border border-zinc-300 text-zinc-700 font-bold text-[15px] transition-all active:scale-[0.97] active:bg-zinc-300"
          >
            <SkipForward className="w-5 h-5" />
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
