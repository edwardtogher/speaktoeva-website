import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageSquare, Check, PhoneIncoming, ThumbsUp, X, Clock, MessageCircle } from "lucide-react";
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
  isGold?: boolean;
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

function getColdSmsTemplate(leadName: string, leadNotes?: string): string {
  // If lead has a personalised message prefixed with MSG:, use that
  if (leadNotes?.startsWith("MSG:")) {
    const sep = leadNotes.indexOf("\\n");
    return sep > 0 ? leadNotes.slice(4, sep) : leadNotes.slice(4);
  }
  return `Hey, sorry for reaching out out of the blue - I know this is a bit of a random one!\n\nI'm based in Farnham and I actually help businesses like ${leadName} handle their inbound calls and enquiries using AI.\n\nWould you be interested in me sending over a quick demo of how it works?\n\nNo worries if not!`;
}

function getSmsUrl(phone: string, body: string): string {
  const encoded = encodeURIComponent(body);
  const cleanPhone = phone.replace(/\s+/g, "").replace(/^0/, "44");
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export default function LeadCard({
  lead,
  disposition,
  expanded,
  attempts,
  texted,
  note,
  isGold = false,
  onToggle,
  onDisposition,
  onSetTexted,
  onStartCall,
}: LeadCardProps) {
  const [justCalled, setJustCalled] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);

  const showTextButton = true;
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
          {lead.whatsappRepliedAt ? (
            <div className="flex items-center gap-1 mt-0.5">
              <MessageCircle className="w-3 h-3 flex-shrink-0" style={{ color: "#25D366" }} />
              <span className="text-[11px] font-medium" style={{ color: "#25D366" }}>WhatsApp replied</span>
            </div>
          ) : lead.whatsappSentAt ? (
            <div className="flex items-center gap-1 mt-0.5">
              <MessageCircle className="w-3 h-3 text-zinc-400 flex-shrink-0" />
              <span className="text-[11px] text-zinc-400 font-medium">WhatsApp sent</span>
            </div>
          ) : null}
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
                    href={getSmsUrl(lead.phone, getColdSmsTemplate(lead.name, lead.notes))}
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

              {/* Gold lead: quick disposition buttons */}
              {isGold && (
                <div className="space-y-2">
                  {/* Inline disposition buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDisposition("interested");
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-xl bg-green-600 text-white font-semibold text-sm transition-all active:scale-[0.97] active:bg-green-700"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Interested
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDisposition("not_interested");
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-xl bg-[#F2F2F7] text-zinc-600 font-semibold text-sm transition-all active:scale-[0.97] active:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                      Not Int.
                    </button>
                  </div>

                  {/* "Called me back" toggle button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCallbackOpen(!callbackOpen);
                    }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 min-h-[44px] rounded-xl font-semibold text-sm transition-all active:scale-[0.97]",
                      callbackOpen
                        ? "bg-amber-100 text-amber-700 border border-amber-300"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                    )}
                  >
                    <PhoneIncoming className="w-4 h-4" />
                    Called me back
                  </button>

                  {/* Callback disposition picker (expanded inline) */}
                  <AnimatePresence>
                    {callbackOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCallbackOpen(false);
                              onDisposition("interested");
                            }}
                            className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl bg-green-600 text-white font-semibold text-xs transition-all active:scale-[0.97] active:bg-green-700"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Interested
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCallbackOpen(false);
                              onDisposition("not_interested");
                            }}
                            className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl bg-zinc-100 text-zinc-600 font-semibold text-xs transition-all active:scale-[0.97] active:bg-zinc-200"
                          >
                            <X className="w-4 h-4" />
                            Not Int.
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCallbackOpen(false);
                              onDisposition("no_answer");
                            }}
                            className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-xs transition-all active:scale-[0.97] active:bg-amber-100"
                          >
                            <Clock className="w-4 h-4" />
                            Reschedule
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
