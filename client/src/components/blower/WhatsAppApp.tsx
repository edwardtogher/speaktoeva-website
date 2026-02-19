import { useState } from "react";
import { useAllLeads } from "@/hooks/use-blower-store";
import WhatsAppLeadCard from "./WhatsAppLeadCard";

type TabKey = "new" | "messaged" | "in_convo" | "interested" | "not_interested";

const TAB_CONFIG: { key: TabKey; label: string; shortLabel: string }[] = [
  { key: "new", label: "New", shortLabel: "New" },
  { key: "messaged", label: "Messaged", shortLabel: "Messaged" },
  { key: "in_convo", label: "In Convo", shortLabel: "In Convo" },
  { key: "interested", label: "Interested", shortLabel: "Interested" },
  { key: "not_interested", label: "Not Int.", shortLabel: "Not Int." },
];

// --- StatsBar ---

function Stat({ label, value, color = "text-zinc-900" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center min-w-[56px]">
      <span className={`text-[17px] font-bold ${color}`}>{value}</span>
      <span className="text-[10px] text-zinc-400 whitespace-nowrap">{label}</span>
    </div>
  );
}

function StatsBar({
  total,
  totalSent,
  replyRate,
  positiveRate,
  negativeRate,
}: {
  total: number;
  totalSent: number;
  replyRate: number;
  positiveRate: number;
  negativeRate: number;
}) {
  return (
    <div className="bg-white border-b border-zinc-200 px-4 py-3 flex items-center gap-4 overflow-x-auto">
      <Stat label="Total" value={total} />
      <Stat label="Sent" value={totalSent} />
      <Stat label="Reply %" value={`${replyRate}%`} />
      <Stat label="👍 Positive" value={`${positiveRate}%`} color="text-green-600" />
      <Stat label="👎 Negative" value={`${negativeRate}%`} color="text-red-500" />
    </div>
  );
}

// --- TabBar ---

function TabBar({
  activeTab,
  onTabChange,
  counts,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  counts: Record<TabKey, number>;
}) {
  return (
    <div className="bg-white border-b border-zinc-200 flex overflow-x-auto">
      {TAB_CONFIG.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-shrink-0 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors min-h-[44px] whitespace-nowrap ${
              isActive
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-zinc-400"
            }`}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        );
      })}
    </div>
  );
}

// --- Main WhatsAppApp ---

export default function WhatsAppApp({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) {
  const { leads, isLoading } = useAllLeads();
  const [activeTab, setActiveTab] = useState<TabKey>("new");

  // Tab filtering
  const newLeads = leads.filter((l) => !l.whatsappSentAt);
  const messagedLeads = leads.filter((l) => l.whatsappSentAt && !l.whatsappRepliedAt);
  const inConvoLeads = leads.filter((l) => l.whatsappRepliedAt && !l.whatsappDisposition);
  const interestedLeads = leads.filter((l) => l.whatsappDisposition === "interested");
  const notInterestedLeads = leads.filter((l) => l.whatsappDisposition === "not_interested");

  // Stats
  const totalSent =
    messagedLeads.length + inConvoLeads.length + interestedLeads.length + notInterestedLeads.length;
  const totalReplied =
    inConvoLeads.length + interestedLeads.length + notInterestedLeads.length;
  const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;
  const positiveRate =
    totalReplied > 0 ? Math.round((interestedLeads.length / totalReplied) * 100) : 0;
  const negativeRate =
    totalReplied > 0 ? Math.round((notInterestedLeads.length / totalReplied) * 100) : 0;

  const counts: Record<TabKey, number> = {
    new: newLeads.length,
    messaged: messagedLeads.length,
    in_convo: inConvoLeads.length,
    interested: interestedLeads.length,
    not_interested: notInterestedLeads.length,
  };

  const filteredLeads = {
    new: newLeads,
    messaged: messagedLeads,
    in_convo: inConvoLeads,
    interested: interestedLeads,
    not_interested: notInterestedLeads,
  }[activeTab];

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-safe pb-3 border-b border-zinc-200 flex items-center justify-between min-h-[52px]">
        <span className="font-semibold text-[17px]">Eva Outreach</span>
        <button
          onClick={onLogout}
          className="text-sm text-zinc-500 py-1 px-2"
        >
          Logout
        </button>
      </div>

      {/* Stats bar */}
      <StatsBar
        total={leads.length}
        totalSent={totalSent}
        replyRate={replyRate}
        positiveRate={positiveRate}
        negativeRate={negativeRate}
      />

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      {/* Lead list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {isLoading && (
          <p className="text-center text-zinc-400 py-8">Loading...</p>
        )}
        {!isLoading && filteredLeads.length === 0 && (
          <p className="text-center text-zinc-400 py-8">No leads here</p>
        )}
        {filteredLeads.map((lead) => (
          <WhatsAppLeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
