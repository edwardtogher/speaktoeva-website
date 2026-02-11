import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageSquare, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lead } from "@/config/blower-leads";
import type { Disposition } from "@/hooks/use-blower-store";


interface LeadCardProps {
  lead: Lead;
  disposition: Disposition | null;
  expanded: boolean;
  attempts: number;
  texted: boolean;
  note?: string;
  onToggle: () => void;
  onDisposition: (d: Disposition | null) => void;
  onSetTexted: () => void;
  onStartCall?: () => void;
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

const SMS_TEMPLATES = [
  "Hi, tried calling a couple of times \u2014 I help businesses like yours stop missing calls when you're busy. Worth a quick chat? Ed, Speak to Eva",
  "Hi, it's Ed again. We help busy businesses never miss a call \u2014 even when you're flat out. 5 mins this week? Just text back a time.",
  "Last message from me \u2014 should I stop reaching out about your phone answering? Totally understand if not a priority right now. Ed",
];

function getSmsTemplate(attempts: number): string {
  if (attempts >= 6) return SMS_TEMPLATES[2];
  if (attempts >= 4) return SMS_TEMPLATES[1];
  return SMS_TEMPLATES[0];
}

function getSmsUrl(phone: string, body: string): string {
  const encoded = encodeURIComponent(body);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  return isIOS ? `sms:${phone}&body=${encoded}` : `sms:${phone}?body=${encoded}`;
}

export default function LeadCard({
  lead,
  disposition,
  expanded,
  attempts,
  texted,
  note,
  onToggle,
  onDisposition,
  onSetTexted,
  onStartCall,
}: LeadCardProps) {
  const [justCalled, setJustCalled] = useState(false);

  const showTextButton = disposition === "no_answer" && attempts >= 2;
  const showTextReminder = attempts >= 3 && !texted && disposition === "no_answer";

  const handleCall = () => {
    setJustCalled(true);
    if (onStartCall) {
      onStartCall();
    }
  };

  return (
    <div
      id={`lead-${lead.id}`}
      className={cn(
        "rounded-2xl transition-all border border-gray-100/50",
        expanded
          ? "bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
          : disposition
            ? "bg-white/60 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
            : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      )}
    >
      {/* Collapsed: name + town + type + badges -- tap to expand */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-4 text-left",
          expanded ? "py-3" : "py-3.5 min-h-[52px] active:bg-gray-50"
        )}
      >
        {/* Disposition indicator */}
        <div className="flex-shrink-0 w-2 h-2 rounded-full">
          {disposition && (
            <div className={cn("w-full h-full rounded-full", DISPOSITION_DOT[disposition])} />
          )}
        </div>

        {/* Lead info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-semibold truncate text-[15px]",
              disposition ? "text-zinc-400" : "text-zinc-900"
            )}>
              {lead.name}
            </span>
            <span className="text-[11px] text-zinc-400 flex-shrink-0">
              {lead.town}
            </span>
          </div>
          {!expanded && note && (
            <p className="text-xs text-zinc-400 truncate mt-0.5">
              {note.length > 40 ? note.slice(0, 40) + "..." : note}
            </p>
          )}
        </div>

        {/* Badges area */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Attempt badge */}
          {attempts > 0 && (
            <span className="text-[10px] text-zinc-500 font-medium tabular-nums bg-[#F2F2F7] px-1.5 py-0.5 rounded">
              x{attempts}
            </span>
          )}
          {/* Texted badge */}
          {texted && (
            <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
              <Check className="w-2.5 h-2.5" />
              Texted
            </span>
          )}
          {/* Type label */}
          <span className="text-[10px] text-zinc-400 font-medium uppercase">
            {TYPE_LABEL[lead.type]}
          </span>
        </div>
      </button>

      {/* Expanded: call button + dispositions */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                  className="flex-1 flex items-center justify-center gap-2.5 min-h-[56px] rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 active:scale-[0.98] text-white font-bold text-lg shadow-md transition-all"
                >
                  <Phone className="w-5 h-5" />
                  CALL
                </a>
                {showTextButton && (
                  <a
                    href={getSmsUrl(lead.phone, getSmsTemplate(attempts))}
                    onClick={() => onSetTexted()}
                    className="flex items-center justify-center gap-1.5 min-h-[56px] px-5 rounded-xl bg-[#F2F2F7] border-none text-zinc-600 font-medium text-sm transition-colors active:bg-gray-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Text
                  </a>
                )}
              </div>

              {/* Text reminder for 3+ attempts without texting */}
              {showTextReminder && (
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-sm">📱</span>
                  <span className="text-xs text-amber-600">
                    Called {attempts} times with no answer — try texting?
                  </span>
                </div>
              )}

              {/* Note display */}
              {note && (
                <div className="rounded-lg bg-[#F2F2F7] px-3 py-2">
                  <p className="text-sm text-zinc-500 whitespace-pre-wrap">{note}</p>
                </div>
              )}

              {/* Existing disposition label if set */}
              {disposition && !justCalled && (
                <p className="text-[11px] text-zinc-400 text-center">
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
