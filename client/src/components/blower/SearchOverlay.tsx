import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Lead } from "@/config/blower-leads";
import type { Disposition } from "@/hooks/use-blower-store";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  dispositions: Record<string, Disposition>;
  attempts: Record<string, number>;
  onSelectLead: (leadId: string) => void;
  leads: Lead[];
}

const TYPE_LABEL: Record<Lead["type"], string> = {
  physio: "Physio",
  chiro: "Chiro",
  osteo: "Osteo",
  multi: "Multi",
  wellness: "Wellness",
};

const DISPOSITION_DOT: Record<Disposition, string> = {
  no_answer: "bg-zinc-400",
  interested: "bg-green-400",
  not_interested: "bg-red-400",
};

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\+]/g, "");
}

export default function SearchOverlay({
  open,
  onClose,
  dispositions,
  attempts,
  onSelectLead,
  leads,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const results = query.trim().length >= 2
    ? leads.filter((lead) => {
        const q = query.trim().toLowerCase();
        const normalizedQuery = normalizePhone(q);
        const normalizedPhone = normalizePhone(lead.phone);
        const normalizedLandline = lead.phoneLandline ? normalizePhone(lead.phoneLandline) : "";

        // Match phone numbers (check if query digits are contained in the phone)
        if (normalizedQuery.length >= 3 && /^\d+$/.test(normalizedQuery)) {
          if (normalizedPhone.includes(normalizedQuery)) return true;
          if (normalizedLandline && normalizedLandline.includes(normalizedQuery)) return true;
        }

        // Match name
        if (lead.name.toLowerCase().includes(q)) return true;

        // Match town
        if (lead.town.toLowerCase().includes(q)) return true;

        return false;
      }).slice(0, 20)
    : [];

  const handleSelect = useCallback(
    (leadId: string) => {
      onSelectLead(leadId);
      onClose();
    },
    [onSelectLead, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] bg-[#F2F2F7] flex flex-col"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Search header */}
          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] pt-[max(env(safe-area-inset-top),12px)] pb-3 px-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-[#F2F2F7] rounded-xl px-3 h-[44px]">
                <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by phone, name, or town..."
                  className="flex-1 bg-transparent text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-full bg-zinc-300 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-indigo-600 font-semibold text-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {query.trim().length < 2 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <Search className="w-10 h-10 text-zinc-300 mb-3" />
                <p className="text-zinc-400 text-sm">
                  Type a phone number, name, or town to search
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <p className="text-zinc-400 text-lg">No leads found</p>
                <p className="text-zinc-400 text-sm mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-1.5">
                <p className="text-xs text-zinc-400 px-1 pb-1">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                {results.map((lead) => {
                  const disp = dispositions[lead.id];
                  const att = attempts[lead.id] || 0;
                  return (
                    <button
                      key={lead.id}
                      onClick={() => handleSelect(lead.id)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] text-left active:bg-gray-50 transition-colors"
                    >
                      {/* Disposition dot */}
                      <div className="flex-shrink-0 w-2 h-2 rounded-full">
                        {disp && (
                          <div className={cn("w-full h-full rounded-full", DISPOSITION_DOT[disp])} />
                        )}
                      </div>

                      {/* Lead info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[15px] text-zinc-900 truncate">
                            {lead.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 uppercase font-medium flex-shrink-0">
                            {TYPE_LABEL[lead.type]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-zinc-500">{lead.town}</span>
                          {lead.phone && (
                            <span className="text-xs text-zinc-400 tabular-nums">{lead.phone}</span>
                          )}
                        </div>
                      </div>

                      {/* Right side badges */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {att > 0 && (
                          <span className="text-[10px] text-zinc-500 font-medium tabular-nums bg-[#F2F2F7] px-1.5 py-0.5 rounded">
                            x{att}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-400 font-medium bg-[#F2F2F7] px-1.5 py-0.5 rounded">
                          {lead.batchLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
