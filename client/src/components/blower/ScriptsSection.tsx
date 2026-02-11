import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

interface ScriptCard {
  id: string;
  title: string;
  subtitle: string;
  color: {
    bg: string;
    border: string;
    header: string;
    headerText: string;
    accent: string;
    badge: string;
  };
  content: React.ReactNode;
}

// --- Script Content Components ---

function NewCallScript() {
  return (
    <div className="space-y-3">
      {/* Opening */}
      <div className="rounded-xl bg-blue-50 border border-blue-200/50 px-3.5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1.5">Opening</p>
        <p className="text-[14px] leading-relaxed text-zinc-800">
          "Hey, how are you? So my name's Edward — I'll be honest, this is a cold call. Can I get{" "}
          <span className="text-blue-600 font-semibold">30 seconds</span>?"
        </p>
      </div>

      {/* If yes */}
      <div className="rounded-xl bg-white/60 border border-gray-100 px-3.5 py-2.5">
        <p className="text-xs text-zinc-500 italic">If yes → go to Pitch below</p>
      </div>

      {/* Gatekeeper */}
      <div className="rounded-xl bg-amber-50 border border-amber-200/50 px-3.5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1.5">
          Gatekeeper — "what's this about?"
        </p>
        <p className="text-[14px] leading-relaxed text-zinc-800">
          "I'm just a local business, was hoping to have a quick word with the owner about their phones.{" "}
          <span className="text-amber-600 font-semibold">Are you the owner?</span>"
        </p>
      </div>
    </div>
  );
}

function GoldCallbackScript() {
  return (
    <div className="space-y-3">
      {/* Callback Opening */}
      <div className="rounded-xl bg-amber-50 border border-amber-200/50 px-3.5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1.5">Callback Opening</p>
        <p className="text-[14px] leading-relaxed text-zinc-800">
          "Oh hey,{" "}
          <span className="text-amber-600 font-semibold">cheers for ringing back</span>. Sorry, I'm not
          actually a patient — bit of a cold call. I'm Ed, I'm based just down the road in Farnham.{" "}
          <span className="text-amber-600 font-semibold">Have you got 30 seconds?</span>"
        </p>
      </div>

      {/* If yes */}
      <div className="rounded-xl bg-white/60 border border-gray-100 px-3.5 py-2.5">
        <p className="text-xs text-zinc-500 italic">If yes → go to regular Pitch below</p>
      </div>
    </div>
  );
}

function CallingBackNowScript() {
  return (
    <div className="space-y-3">
      {/* Emergency Opening */}
      <div className="rounded-xl bg-teal-50 border border-teal-200/50 px-3.5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-1.5">Opening</p>
        <p className="text-[14px] leading-relaxed text-zinc-800">
          "Oh hey,{" "}
          <span className="text-teal-600 font-semibold">cheers for ringing back</span>. Sorry, I'm not
          actually a patient — bit of a cold call. I'm Ed, I'm based just down the road in Farnham.{" "}
          <span className="text-teal-600 font-semibold">Have you got 30 seconds?</span>"
        </p>
      </div>

      {/* Instant callback pitch */}
      <div className="rounded-xl bg-teal-50 border border-teal-200/50 px-3.5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-1.5">Pitch — Callback Hook</p>
        <p className="text-[14px] leading-relaxed text-zinc-800">
          "So I've built an AI receptionist for physio clinics — answers your calls when you're with patients,
          books people in. You just called me back from a missed call, which is{" "}
          <span className="text-teal-600 font-semibold">kinda the exact problem it solves</span>.
          Worth a quick chat?"
        </p>
      </div>
    </div>
  );
}

function SharedPitchAndObjections() {
  return (
    <div className="space-y-3">
      {/* Pitch */}
      <div className="rounded-xl bg-purple-50 border border-purple-200/50 px-3.5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-1.5">Pitch</p>
        <p className="text-[14px] leading-relaxed text-zinc-800">
          "Yeah, so I'm based in Farnham. [Case study] — building them an AI receptionist to handle their
          incoming calls, texts, and emails. Basically making sure they{" "}
          <span className="text-purple-600 font-semibold">never miss an enquiry</span>."
        </p>
      </div>

      {/* Demo Close */}
      <div className="rounded-xl bg-green-50 border border-green-200/50 px-3.5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1.5">Demo Close</p>
        <p className="text-[14px] leading-relaxed text-green-700 font-medium">
          "I've actually put together a personalised demo specifically for your clinic — could I send that over
          to you?"
        </p>
      </div>

      {/* Objections */}
      <div className="rounded-xl bg-white border border-gray-100 px-3.5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2.5">Key Objections</p>
        <div className="space-y-2">
          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
            <p className="text-[12px] text-red-400 font-medium mb-0.5">"I just call them back"</p>
            <p className="text-zinc-700 text-[13px] leading-relaxed">
              "Yeah, but when your patients ring and nobody picks up — do they wait? Or do they just Google
              the next physio and book there?"
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
            <p className="text-[12px] text-red-400 font-medium mb-0.5">"Not interested"</p>
            <p className="text-zinc-700 text-[13px] leading-relaxed">
              "Totally fair. Just out of curiosity — is it because you've got phone stuff sorted, or just{" "}
              <span className="text-zinc-900 font-semibold">bad timing</span>?"
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
            <p className="text-[12px] text-red-400 font-medium mb-0.5">"Send me an email"</p>
            <p className="text-zinc-700 text-[13px] leading-relaxed">
              "I can do that — but real talk, your inbox is probably rammed. I've got a{" "}
              <span className="text-zinc-900 font-semibold">60-second voice demo</span> I can WhatsApp you
              instead."
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
            <p className="text-[12px] text-red-400 font-medium mb-0.5">"How much?"</p>
            <p className="text-zinc-700 text-[13px] leading-relaxed">
              "About <span className="text-zinc-900 font-semibold">&pound;250/mo</span> — less than a
              receptionist for one day a week, and Eva works 24/7."
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
            <p className="text-[12px] text-red-400 font-medium mb-0.5">"AI can't handle my patients"</p>
            <p className="text-zinc-700 text-[13px] leading-relaxed">
              "Most AI is terrible — I get it. That's why I built this differently. I've got a client in
              London whose customers{" "}
              <span className="text-zinc-900 font-semibold">ask for the AI by name</span>."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Script Card Definitions ---

const SCRIPTS: ScriptCard[] = [
  {
    id: "new-call",
    title: "New Call",
    subtitle: "Cold call opener",
    color: {
      bg: "bg-white",
      border: "border-l-4 border-l-indigo-500",
      header: "bg-indigo-50",
      headerText: "text-indigo-700",
      accent: "text-indigo-500",
      badge: "bg-indigo-100 text-indigo-600",
    },
    content: <NewCallScript />,
  },
  {
    id: "gold-callback",
    title: "Gold Callback",
    subtitle: "They rang back from Gold",
    color: {
      bg: "bg-white",
      border: "border-l-4 border-l-amber-500",
      header: "bg-amber-50",
      headerText: "text-amber-700",
      accent: "text-amber-500",
      badge: "bg-amber-100 text-amber-600",
    },
    content: <GoldCallbackScript />,
  },
  {
    id: "calling-back-now",
    title: "They're Calling Back NOW",
    subtitle: "Emergency — live callback",
    color: {
      bg: "bg-white",
      border: "border-l-4 border-l-teal-500",
      header: "bg-teal-50",
      headerText: "text-teal-700",
      accent: "text-teal-500",
      badge: "bg-teal-100 text-teal-600",
    },
    content: <CallingBackNowScript />,
  },
];

// --- Main Component ---

export default function ScriptsSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pitchOpen, setPitchOpen] = useState(false);

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

        {/* Pitch & Objections — always available as its own expandable card */}
        <div
          className={cn(
            "rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white border-l-4 border-l-purple-500"
          )}
        >
          <button
            onClick={() => setPitchOpen((prev) => !prev)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left active:bg-gray-50/50 transition-colors"
          >
            <div className="min-w-0">
              <p className="font-bold text-[15px] text-purple-700">Pitch & Objections</p>
              <p className="text-xs text-zinc-400 mt-0.5">Shared across all scripts</p>
            </div>
            <motion.div
              animate={{ rotate: pitchOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 ml-3"
            >
              <ChevronDown className="w-5 h-5 text-purple-500" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {pitchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <SharedPitchAndObjections />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
