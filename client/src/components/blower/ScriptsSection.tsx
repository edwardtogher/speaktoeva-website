import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ScriptOpening,
  ScriptGatekeeper,
  ScriptGoldCallbackOpening,
  ScriptCallingBackNowOpening,
  ScriptCallingBackNowPitch,
  ScriptPitch,
  ScriptDemoClose,
  ScriptClose,
  ScriptObjections,
  ScriptStats,
} from "@/config/blower-scripts";

// --- Types ---

interface ScriptCard {
  id: string;
  title: string;
  subtitle: string;
  color: {
    bg: string;
    border: string;
    headerText: string;
    accent: string;
  };
  content: React.ReactNode;
}

// --- Full Script Content Components ---

function NewCallFullScript() {
  return (
    <div className="space-y-3">
      {/* 1. Opening */}
      <div className="rounded-2xl bg-blue-50 border border-blue-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-blue-700 tabular-nums">1</span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Opening</span>
        </div>
        <div className="px-4 pb-4"><ScriptOpening /></div>
      </div>

      {/* 2. Gatekeeper */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-amber-700 tabular-nums">2</span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Gatekeeper</span>
          <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-medium">IF NEEDED</span>
        </div>
        <div className="px-4 pb-4"><ScriptGatekeeper /></div>
      </div>

      {/* 3. Pitch */}
      <div className="rounded-2xl bg-purple-50 border border-purple-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-purple-700 tabular-nums">3</span>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Pitch</span>
        </div>
        <div className="px-4 pb-4"><ScriptPitch /></div>
      </div>

      {/* 4. Demo Close */}
      <div className="rounded-2xl bg-green-50 border border-green-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-green-700 tabular-nums">4</span>
          <span className="text-xs font-bold uppercase tracking-wider text-green-700">Demo Close</span>
        </div>
        <div className="px-4 pb-4"><ScriptDemoClose /></div>
      </div>

      {/* 5. Close */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-emerald-700 tabular-nums">5</span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Close</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded font-medium">IF YES</span>
        </div>
        <div className="px-4 pb-4"><ScriptClose /></div>
      </div>

      {/* 6. Objections */}
      <div className="rounded-2xl bg-white border border-gray-100/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-red-600 tabular-nums">6</span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">Objections</span>
        </div>
        <div className="px-4 pb-4"><ScriptObjections /></div>
      </div>

      {/* 7. Stats to Drop */}
      <div className="rounded-2xl bg-gray-50 border border-gray-100/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-zinc-500 tabular-nums">7</span>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stats to Drop</span>
        </div>
        <div className="px-4 pb-4"><ScriptStats /></div>
      </div>
    </div>
  );
}

function GoldCallbackFullScript() {
  return (
    <div className="space-y-3">
      {/* 1. Follow-Up Opening */}
      <div className="rounded-2xl bg-amber-50 border border-amber-300/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-amber-700 tabular-nums">1</span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Follow-Up Opening</span>
          <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-medium">YOU'RE CALLING BACK</span>
        </div>
        <div className="px-4 pb-4"><ScriptGoldCallbackOpening /></div>
      </div>

      {/* 2. Pitch */}
      <div className="rounded-2xl bg-purple-50 border border-purple-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-purple-700 tabular-nums">2</span>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Pitch</span>
        </div>
        <div className="px-4 pb-4"><ScriptPitch /></div>
      </div>

      {/* 3. Demo Close */}
      <div className="rounded-2xl bg-green-50 border border-green-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-green-700 tabular-nums">3</span>
          <span className="text-xs font-bold uppercase tracking-wider text-green-700">Demo Close</span>
        </div>
        <div className="px-4 pb-4"><ScriptDemoClose /></div>
      </div>

      {/* 4. Close */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-emerald-700 tabular-nums">4</span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Close</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded font-medium">IF YES</span>
        </div>
        <div className="px-4 pb-4"><ScriptClose /></div>
      </div>

      {/* 5. Objections */}
      <div className="rounded-2xl bg-white border border-gray-100/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-red-600 tabular-nums">5</span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">Objections</span>
        </div>
        <div className="px-4 pb-4"><ScriptObjections /></div>
      </div>

      {/* 6. Stats to Drop */}
      <div className="rounded-2xl bg-gray-50 border border-gray-100/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-zinc-500 tabular-nums">6</span>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stats to Drop</span>
        </div>
        <div className="px-4 pb-4"><ScriptStats /></div>
      </div>
    </div>
  );
}

function CallingBackNowFullScript() {
  return (
    <div className="space-y-3">
      {/* 1. Emergency Opening */}
      <div className="rounded-2xl bg-teal-50 border border-teal-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-teal-700 tabular-nums">1</span>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Opening</span>
          <span className="text-[10px] text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded font-medium">RINGING NOW</span>
        </div>
        <div className="px-4 pb-4"><ScriptCallingBackNowOpening /></div>
      </div>

      {/* 2. Callback Pitch (unique hook) */}
      <div className="rounded-2xl bg-teal-50 border border-teal-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-teal-700 tabular-nums">2</span>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Pitch — Callback Hook</span>
        </div>
        <div className="px-4 pb-4"><ScriptCallingBackNowPitch /></div>
      </div>

      {/* 3. Demo Close */}
      <div className="rounded-2xl bg-green-50 border border-green-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-green-700 tabular-nums">3</span>
          <span className="text-xs font-bold uppercase tracking-wider text-green-700">Demo Close</span>
        </div>
        <div className="px-4 pb-4"><ScriptDemoClose /></div>
      </div>

      {/* 4. Close */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-emerald-700 tabular-nums">4</span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Close</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded font-medium">IF YES</span>
        </div>
        <div className="px-4 pb-4"><ScriptClose /></div>
      </div>

      {/* 5. Objections */}
      <div className="rounded-2xl bg-white border border-gray-100/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-red-600 tabular-nums">5</span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">Objections</span>
        </div>
        <div className="px-4 pb-4"><ScriptObjections /></div>
      </div>

      {/* 6. Stats to Drop */}
      <div className="rounded-2xl bg-gray-50 border border-gray-100/50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-[13px] font-bold text-zinc-500 tabular-nums">6</span>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stats to Drop</span>
        </div>
        <div className="px-4 pb-4"><ScriptStats /></div>
      </div>
    </div>
  );
}

// --- Script Card Definitions ---

const SCRIPTS: ScriptCard[] = [
  {
    id: "new-call",
    title: "New Call",
    subtitle: "Full cold call script",
    color: {
      bg: "bg-white",
      border: "border-l-4 border-l-indigo-500",
      headerText: "text-indigo-700",
      accent: "text-indigo-500",
    },
    content: <NewCallFullScript />,
  },
  {
    id: "gold-callback",
    title: "Gold Callback",
    subtitle: "They rang back from Gold",
    color: {
      bg: "bg-white",
      border: "border-l-4 border-l-amber-500",
      headerText: "text-amber-700",
      accent: "text-amber-500",
    },
    content: <GoldCallbackFullScript />,
  },
  {
    id: "calling-back-now",
    title: "They're Calling Back NOW",
    subtitle: "Emergency — live callback",
    color: {
      bg: "bg-white",
      border: "border-l-4 border-l-teal-500",
      headerText: "text-teal-700",
      accent: "text-teal-500",
    },
    content: <CallingBackNowFullScript />,
  },
];

// --- Main Component ---

export default function ScriptsSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 pt-4 pb-1">
        <FileText className="w-5 h-5 text-zinc-400" />
        <h2 className="text-2xl font-black text-zinc-500">Scripts</h2>
      </div>

      {/* Script cards */}
      <div className="space-y-2.5 mt-1">
        {SCRIPTS.map((script) => {
          const isOpen = openId === script.id;

          return (
            <div
              key={script.id}
              className={cn(
                "rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
                script.color.bg,
                script.color.border
              )}
            >
              {/* Tappable header */}
              <button
                onClick={() => handleToggle(script.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left active:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className={cn("font-bold text-[15px]", script.color.headerText)}>
                    {script.title}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">{script.subtitle}</p>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-3"
                >
                  <ChevronDown className={cn("w-5 h-5", script.color.accent)} />
                </motion.div>
              </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">{script.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
