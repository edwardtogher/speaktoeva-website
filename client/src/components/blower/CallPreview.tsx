import { motion } from "framer-motion";
import { Phone, MessageSquare, SkipForward, X, Check } from "lucide-react";
import type { Lead } from "@/config/blower-leads";

function getColdSmsUrl(phone: string, leadName: string): string {
  const body = `Hey, sorry for reaching out out of the blue - I know this is a bit of a random one! I actually help businesses like ${leadName} handle their inbound calls and enquiries using AI. Would you be interested in me sending over a bit of info on what other businesses in your area are doing right now?`;
  const encoded = encodeURIComponent(body);
  const cleanPhone = phone.replace(/\s+/g, "").replace(/^0/, "44");
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

interface CallPreviewProps {
  lead: Lead;
  isGold: boolean;
  attempts: number;
  texted: boolean;
  batchLabel: string;
  onCall: () => void;
  onText: () => void;
  onSkip: () => void;
  onDismiss: () => void;
}

export default function CallPreview({
  lead,
  isGold,
  attempts,
  texted,
  batchLabel,
  onCall,
  onText,
  onSkip,
  onDismiss,
}: CallPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm mx-4 rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5 text-center space-y-4">
          {/* Badges */}
          <div className="flex items-center justify-center gap-2">
            {isGold ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                Callback x{attempts}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                New Call
              </span>
            )}
            {texted && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <Check className="w-3 h-3" />
                Texted
              </span>
            )}
          </div>

          {/* Batch label */}
          <p className="text-xs text-zinc-400">{batchLabel}</p>

          {/* Lead name */}
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{lead.name}</h2>
            <p className="text-sm text-zinc-500 mt-0.5">{lead.town}</p>
          </div>

          {/* Phone number */}
          <p className="text-sm text-zinc-500 tabular-nums">{lead.phone}</p>

          {/* CALL + TEXT buttons */}
          <div className="flex gap-2">
            <a
              href={`tel:${lead.phone}`}
              onClick={(e) => {
                onCall();
              }}
              className="flex-1 flex items-center justify-center gap-2.5 min-h-[56px] rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 active:scale-[0.98] text-white font-bold text-lg shadow-md transition-all"
            >
              <Phone className="w-5 h-5" />
              CALL
            </a>
            <a
              href={getColdSmsUrl(lead.phone, lead.name)}
              onClick={() => onText()}
              className="flex items-center justify-center gap-1.5 min-h-[56px] px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:scale-[0.98] text-white font-bold text-lg shadow-md transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              TEXT
            </a>
          </div>

          {/* Skip + Cancel buttons */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <button
              onClick={onSkip}
              className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium min-h-[44px] px-3 active:text-zinc-700 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 text-sm text-zinc-400 font-medium min-h-[44px] px-3 active:text-zinc-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
