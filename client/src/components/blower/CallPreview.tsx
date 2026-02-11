import { motion } from "framer-motion";
import { Phone, SkipForward, X } from "lucide-react";
import type { Lead } from "@/config/blower-leads";

interface CallPreviewProps {
  lead: Lead;
  isGold: boolean;
  attempts: number;
  batchLabel: string;
  onCall: () => void;
  onSkip: () => void;
  onDismiss: () => void;
}

export default function CallPreview({
  lead,
  isGold,
  attempts,
  batchLabel,
  onCall,
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
          {/* Badge */}
          {isGold ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              Callback x{attempts}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
              New Call
            </span>
          )}

          {/* Batch label */}
          <p className="text-xs text-zinc-400">{batchLabel}</p>

          {/* Lead name */}
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{lead.name}</h2>
            <p className="text-sm text-zinc-500 mt-0.5">{lead.town}</p>
          </div>

          {/* Phone number */}
          <p className="text-sm text-zinc-500 tabular-nums">{lead.phone}</p>

          {/* Big CALL button -- must be <a> for iOS PWA dialling */}
          <a
            href={`tel:${lead.phone}`}
            onClick={(e) => {
              // Don't prevent default -- let tel: link fire
              onCall();
            }}
            className="flex items-center justify-center gap-2.5 w-full min-h-[56px] rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 active:scale-[0.98] text-white font-bold text-lg shadow-md transition-all"
          >
            <Phone className="w-5 h-5" />
            CALL
          </a>

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
