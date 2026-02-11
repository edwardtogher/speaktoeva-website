import { motion } from "framer-motion";
import { Phone } from "lucide-react";

interface CallNextButtonProps {
  nextLeadName: string | null;
  isGoldLead?: boolean;
  onTap: () => void;
}

export default function CallNextButton({ nextLeadName, isGoldLead, onTap }: CallNextButtonProps) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.15 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}
    >
      <motion.button
        onClick={onTap}
        whileTap={{ scale: 0.96 }}
        className={
          isGoldLead
            ? "pointer-events-auto flex items-center gap-2.5 bg-amber-600 text-white rounded-full px-6 shadow-[0_4px_20px_rgba(217,119,6,0.45)] active:shadow-[0_2px_10px_rgba(217,119,6,0.3)]"
            : "pointer-events-auto flex items-center gap-2.5 bg-indigo-600 text-white rounded-full px-6 shadow-[0_4px_20px_rgba(79,70,229,0.45)] active:shadow-[0_2px_10px_rgba(79,70,229,0.3)]"
        }
        style={{ minHeight: 56 }}
      >
        <Phone className="w-5 h-5 flex-shrink-0" />
        <span className="font-bold text-[15px] truncate max-w-[220px]">
          {isGoldLead && nextLeadName
            ? `Gold: ${nextLeadName}`
            : nextLeadName
              ? `Call ${nextLeadName}`
              : "Pick a batch to start"}
        </span>
      </motion.button>
    </motion.div>
  );
}
