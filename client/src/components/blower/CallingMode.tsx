import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PhoneMissed, ThumbsUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { Lead } from "@/config/blower-leads";
import type { Disposition } from "@/hooks/use-blower-store";

// --- Types ---

interface CallingModeProps {
  lead: Lead;
  batchId?: string;
  existingNote: string;
  existingTags: string[];
  onComplete: (disposition: Disposition, note: string, tags: string[]) => void;
  onBack: () => void;
}

// --- Constants ---

const QUICK_TAGS = ["CB", "DM", "VM", "Send Demo", "Has Recep", "No Recep"] as const;

const TYPE_LABEL: Record<Lead["type"], string> = {
  physio: "Physio",
  chiro: "Chiro",
  osteo: "Osteo",
  multi: "Multi",
  wellness: "Wellness",
};

const TYPE_COLOR: Record<Lead["type"], string> = {
  physio: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  chiro: "bg-purple-600/20 text-purple-400 border-purple-500/30",
  osteo: "bg-amber-600/20 text-amber-400 border-amber-500/30",
  multi: "bg-teal-600/20 text-teal-400 border-teal-500/30",
  wellness: "bg-pink-600/20 text-pink-400 border-pink-500/30",
};

const SIGNAL_LABEL: Record<string, string> = {
  hiring: "Hiring",
  ads: "Running Ads",
  local: "Local",
  "hiring+local": "Hiring + Local",
  "ads+local": "Ads + Local",
};

const SIGNAL_COLOR: Record<string, string> = {
  hiring: "bg-orange-600/20 text-orange-400 border-orange-500/30",
  ads: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
  local: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
  "hiring+local": "bg-orange-600/20 text-orange-400 border-orange-500/30",
  "ads+local": "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
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

// --- Component ---

export default function CallingMode({
  lead,
  batchId,
  existingNote,
  existingTags,
  onComplete,
  onBack,
}: CallingModeProps) {
  const [tags, setTags] = useState<string[]>(existingTags);
  const [note, setNote] = useState(existingNote);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteRef = useRef(note);

  const { location, caseStudy } = getOpening(batchId);

  const showSignal = lead.signal !== "local";

  // Toggle a tag on/off
  const toggleTag = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  // Debounced note save (updates ref immediately, no external save until disposition)
  const handleNoteChange = useCallback((value: string) => {
    setNote(value);
    noteRef.current = value;
  }, []);

  // Handle disposition tap
  const handleDisposition = useCallback(
    (disposition: Disposition) => {
      onComplete(disposition, noteRef.current, tags);
    },
    [onComplete, tags]
  );

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col"
    >
      {/* ===== STICKY HEADER ===== */}
      <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800/60 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
        {/* Back + Lead name row */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors -ml-2"
            aria-label="Exit calling mode"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{lead.name}</h1>
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
        </div>
      </div>

      {/* ===== STICKY TAGS + NOTES ===== */}
      <div className="sticky top-[auto] z-10 bg-zinc-950 border-b border-zinc-800/40 px-4 py-3">
        {/* Quick tags row */}
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "min-h-[36px] px-3 rounded-full text-[13px] font-semibold border transition-all active:scale-95",
                  active
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-zinc-800/60 border-zinc-700/50 text-zinc-400"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Notes input */}
        <input
          type="text"
          value={note}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Quick note..."
          className="w-full h-[44px] px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-[15px] placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-transparent"
        />
      </div>

      {/* ===== SCROLLABLE SCRIPT ACCORDION ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-[140px]">
        <Accordion type="single" collapsible defaultValue="opening" className="space-y-3">
          {/* 1. Opening */}
          <AccordionItem
            value="opening"
            className="border-0 rounded-xl bg-blue-950/40 border border-blue-800/40 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-blue-400 tabular-nums">1</span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Opening
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-0">
              <p className="text-[15px] leading-relaxed text-zinc-200">
                "Hey, how are you? So my name's Edward — I'll be honest, this is a cold call. Can I
                get <span className="text-blue-300 font-semibold">30 seconds</span>?"
              </p>
              <div className="mt-2.5 bg-zinc-900/60 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-500 italic">
                  If yes - go to Pitch. If "what's this about?" - go to Gatekeeper.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 2. Gatekeeper */}
          <AccordionItem
            value="gatekeeper"
            className="border-0 rounded-xl bg-amber-950/30 border border-amber-800/30 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-amber-900/20">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-amber-400 tabular-nums">2</span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Gatekeeper
                </span>
                <span className="text-[10px] text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">
                  IF NEEDED
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-0">
              <p className="text-[15px] leading-relaxed text-zinc-200">
                "I'm just a local business, was hoping to have a quick word with the owner about
                their phones.{" "}
                <span className="text-amber-300 font-semibold">Are you the owner?</span>"
              </p>
              <div className="mt-2.5 bg-zinc-900/60 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-500 italic">
                  If not the owner: "No worries — who's best to speak to?" Get a name, move on.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3. Pitch */}
          <AccordionItem
            value="pitch"
            className="border-0 rounded-xl bg-purple-950/30 border border-purple-800/30 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-purple-900/20">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-purple-400 tabular-nums">3</span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Pitch
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-0">
              <p className="text-[15px] leading-relaxed text-zinc-200">
                "Yeah, so{" "}
                <span className="text-purple-300 font-semibold">{location}</span>. {caseStudy} —
                building them an AI receptionist to handle their incoming calls, texts, and emails.
                Basically making sure they{" "}
                <span className="text-purple-300 font-semibold">never miss an enquiry</span>."
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* 4. Demo Close */}
          <AccordionItem
            value="demo-close"
            className="border-0 rounded-xl bg-green-950/40 border border-green-800/40 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-green-900/20">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-green-400 tabular-nums">4</span>
                <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                  Demo Close
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-0">
              <p className="text-[15px] leading-relaxed text-green-300 font-medium">
                "I've actually put together a personalised demo specifically for your clinic — could
                I send that over to you?"
              </p>
              <div className="mt-2.5 bg-green-900/20 rounded-lg px-3 py-2 border border-green-800/20">
                <p className="text-xs text-green-400/80 font-medium">
                  If yes: "Amazing — are you on WhatsApp on this number? I'll send it straight
                  over."
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 5. Objections */}
          <AccordionItem
            value="objections"
            className="border-0 rounded-xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/30">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-red-400 tabular-nums">5</span>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Objections
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-0">
              <Accordion type="single" collapsible className="space-y-1.5">
                <AccordionItem
                  value="not-interested"
                  className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40"
                >
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "Not interested"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "Totally fair. Just out of curiosity — is it because you've got phone stuff
                    sorted, or just
                    <span className="text-white font-semibold"> bad timing</span>?" If bad timing:
                    "When's better to catch you?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="email"
                  className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40"
                >
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "Just send me an email"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "I can do that — but real talk, your inbox is probably rammed. I've got a
                    <span className="text-white font-semibold"> 60-second voice demo</span> I can
                    WhatsApp you instead. Way quicker than reading an email. Can I send that over?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="receptionist"
                  className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40"
                >
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "I already have a receptionist"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "Nice. What about{" "}
                    <span className="text-white font-semibold">after hours and weekends</span>?
                    That's when a lot of online enquiries come through. Most clinics use Eva as the
                    backup. Worth a look at the demo?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="price"
                  className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40"
                >
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "How much is it?"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "It's about{" "}
                    <span className="text-white font-semibold">£250/mo</span> — less than a
                    receptionist for one day a week, and Eva works 24/7. Best thing is to hear her
                    first though — if she sounds rubbish, the price doesn't matter."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="ai"
                  className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40"
                >
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "AI can't handle my patients"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "Most AI is terrible — I get it. That's why I built this differently. I've got a
                    client in London whose customers{" "}
                    <span className="text-white font-semibold">ask for the AI by name</span>. Have a
                    listen to the demo and see what you think."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="think"
                  className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40"
                >
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "I need to think about it"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "Of course. Let me WhatsApp you the demo — have a listen when you've got
                    <span className="text-white font-semibold"> 60 seconds</span>. No pressure, just
                    reply if you want to chat more."
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          {/* 6. Stats to Drop */}
          <AccordionItem
            value="stats"
            className="border-0 rounded-xl bg-zinc-900/30 border border-zinc-800/30 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/30">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-zinc-500 tabular-nums">6</span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Stats to Drop
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-0">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="text-sm text-zinc-500 mt-0.5">1.</span>
                  <p className="text-[14px] text-zinc-400">
                    85% of callers who get voicemail{" "}
                    <span className="text-white font-medium">never call back</span>
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-sm text-zinc-500 mt-0.5">2.</span>
                  <p className="text-[14px] text-zinc-400">
                    78% of patients book with{" "}
                    <span className="text-white font-medium">whoever answers first</span>
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-sm text-zinc-500 mt-0.5">3.</span>
                  <p className="text-[14px] text-zinc-400">
                    One extra patient/week at £50 and{" "}
                    <span className="text-white font-medium">she's paid for herself</span>
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ===== STICKY DISPOSITION BAR (BOTTOM) ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800/60 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
        <div className="flex gap-2">
          {/* No Answer */}
          <button
            onClick={() => handleDisposition("no_answer")}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-xl bg-zinc-800 border border-zinc-700/50 text-zinc-300 font-bold text-[15px] transition-all active:scale-[0.97] active:bg-zinc-700"
          >
            <PhoneMissed className="w-5 h-5" />
            No Answer
          </button>

          {/* Interested */}
          <button
            onClick={() => handleDisposition("interested")}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-xl bg-green-600 border border-green-500 text-white font-bold text-[15px] shadow-[0_0_24px_rgba(34,197,94,0.3)] transition-all active:scale-[0.97] active:bg-green-700"
          >
            <ThumbsUp className="w-5 h-5" />
            Interested
          </button>

          {/* Not Interested */}
          <button
            onClick={() => handleDisposition("not_interested")}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-xl bg-red-600/80 border border-red-500/50 text-white font-bold text-[15px] transition-all active:scale-[0.97] active:bg-red-700"
          >
            <X className="w-5 h-5" />
            Not Int.
          </button>
        </div>
      </div>
    </motion.div>
  );
}
