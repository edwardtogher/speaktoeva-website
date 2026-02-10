import { cn } from "@/lib/utils";
import type { Lead } from "@/config/blower-leads";
import type { Disposition } from "@/hooks/use-blower-store";

interface WinsShelfProps {
  leads: Lead[];
  dispositions: Record<string, Disposition>;
  onTap: (leadId: string) => void;
}

const TYPE_COLORS: Record<Lead["type"], string> = {
  physio: "bg-blue-500/20 text-blue-400",
  chiro: "bg-purple-500/20 text-purple-400",
  osteo: "bg-teal-500/20 text-teal-400",
  multi: "bg-amber-500/20 text-amber-400",
  wellness: "bg-pink-500/20 text-pink-400",
};

// Note: This component is no longer used in the simplified dialler UI.
// Kept for backward compatibility. The "Wins" tab in FilterBar replaces it.
export default function WinsShelf({ leads, dispositions, onTap }: WinsShelfProps) {
  if (leads.length === 0) return null;

  return (
    <div className="mb-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 px-1">
        Wins
      </h3>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {leads.map((lead) => {
          const d = dispositions[lead.id];
          const isInterested = d === "interested";

          return (
            <button
              key={lead.id}
              onClick={() => onTap(lead.id)}
              className={cn(
                "flex-shrink-0 rounded-lg px-3 py-2 border min-w-[140px] text-left transition-colors",
                isInterested
                  ? "border-green-500/60 bg-green-950/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                  : "border-zinc-700/40 bg-zinc-900/20",
                "hover:bg-zinc-800/50"
              )}
            >
              <p className="text-sm font-medium text-white truncate">{lead.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-zinc-500">{lead.town}</span>
                <span
                  className={cn(
                    "text-[10px] px-1 py-0.5 rounded font-medium",
                    TYPE_COLORS[lead.type]
                  )}
                >
                  {lead.type}
                </span>
              </div>
              {isInterested && (
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-semibold bg-green-500/25 text-green-400">
                  INTERESTED
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
