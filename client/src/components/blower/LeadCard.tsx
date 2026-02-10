import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lead } from "@/config/blower-leads";
import type { Disposition } from "@/hooks/use-blower-store";
import DispositionBar from "./DispositionBar";

interface LeadCardProps {
  lead: Lead;
  disposition: Disposition | null;
  expanded: boolean;
  onToggle: () => void;
  onDisposition: (d: Disposition | null) => void;
}

const TYPE_LABEL: Record<Lead["type"], string> = {
  physio: "Physio",
  chiro: "Chiro",
  osteo: "Osteo",
  multi: "Multi",
  wellness: "Wellness",
};

const DISPOSITION_LABEL: Record<Disposition, string> = {
  no_answer: "No Answer",
  interested: "Interested",
  not_interested: "Not Interested",
};

const DISPOSITION_DOT: Record<Disposition, string> = {
  no_answer: "bg-zinc-400",
  interested: "bg-green-400",
  not_interested: "bg-red-400",
};

const DEFAULT_SMS =
  "Hi, I just tried calling - I work with physio clinics on their phone answering. Would love 2 mins of your time. Edward, Speak to Eva";

function getSmsUrl(phone: string, body: string): string {
  const encoded = encodeURIComponent(body);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  return isIOS ? `sms:${phone}&body=${encoded}` : `sms:${phone}?body=${encoded}`;
}

export default function LeadCard({
  lead,
  disposition,
  expanded,
  onToggle,
  onDisposition,
}: LeadCardProps) {
  const [justCalled, setJustCalled] = useState(false);

  const showTextButton = disposition === "no_answer";

  // Tapping the collapsed card expands it (ready to call)
  // The CALL button actually initiates the phone call
  const handleCall = () => {
    setJustCalled(true);
    // The tel: link handles the actual call
  };

  return (
    <div
      id={`lead-${lead.id}`}
      className={cn(
        "rounded-xl border transition-all",
        expanded
          ? "bg-zinc-900 border-zinc-700"
          : disposition
            ? "bg-zinc-900/30 border-zinc-800/30"
            : "bg-zinc-900/60 border-zinc-800/50"
      )}
    >
      {/* Collapsed: name + town + type — tap to expand */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-4 text-left",
          expanded ? "py-3" : "py-3.5"
        )}
      >
        {/* Disposition indicator */}
        <div className="flex-shrink-0 w-2 h-2 rounded-full">
          {disposition && (
            <div className={cn("w-full h-full rounded-full", DISPOSITION_DOT[disposition])} />
          )}
        </div>

        {/* Lead info — one tight line */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className={cn(
            "font-semibold truncate text-[15px]",
            disposition ? "text-zinc-500" : "text-white"
          )}>
            {lead.name}
          </span>
          <span className="text-[11px] text-zinc-600 flex-shrink-0">
            {lead.town}
          </span>
        </div>

        {/* Type label — compact */}
        <span className="text-[10px] text-zinc-600 font-medium flex-shrink-0 uppercase">
          {TYPE_LABEL[lead.type]}
        </span>
      </button>

      {/* Expanded: call button + dispositions */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Phone number display */}
              <p className="text-sm text-zinc-500 tabular-nums">{lead.phone}</p>

              {/* Big CALL button + optional Text */}
              <div className="flex gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  onClick={handleCall}
                  className="flex-1 flex items-center justify-center gap-2.5 min-h-[56px] rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 active:scale-[0.98] text-white font-bold text-lg transition-all"
                >
                  <Phone className="w-5 h-5" />
                  CALL
                </a>
                {showTextButton && (
                  <a
                    href={getSmsUrl(lead.phone, DEFAULT_SMS)}
                    className="flex items-center justify-center gap-1.5 min-h-[56px] px-5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium text-sm transition-colors active:bg-zinc-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Text
                  </a>
                )}
              </div>

              {/* Disposition — always visible when expanded */}
              <DispositionBar
                active={disposition}
                onSelect={(d) => {
                  onDisposition(d === disposition ? null : d);
                }}
              />

              {/* Existing disposition label if set */}
              {disposition && !justCalled && (
                <p className="text-[11px] text-zinc-600 text-center">
                  Tap disposition again to clear
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
