import { useState, useMemo } from "react";
import { useAllLeads } from "@/hooks/use-blower-store";
import WhatsAppLeadCard from "./WhatsAppLeadCard";

type TabKey = "new" | "messaged" | "in_convo" | "interested" | "not_interested";

const TAB_CONFIG: { key: TabKey; label: string }[] = [
  { key: "new", label: "New" },
  { key: "messaged", label: "Sent" },
  { key: "in_convo", label: "Replied" },
  { key: "interested", label: "Interested" },
  { key: "not_interested", label: "No" },
];

const ACCOUNTS = [
  { key: "number_1", label: "Number 1" },
  { key: "number_2", label: "Number 2" },
  { key: "number_3", label: "Number 3" },
] as const;

type AccountKey = (typeof ACCOUNTS)[number]["key"];

// --- StatsBar ---

function Stat({ label, value, color = "text-zinc-900" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center min-w-[48px]">
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
  sentToday,
}: {
  total: number;
  totalSent: number;
  replyRate: number;
  positiveRate: number;
  negativeRate: number;
  sentToday: number;
}) {
  return (
    <div className="bg-white border-b border-zinc-200 px-2 py-2 flex items-center justify-around">
      <Stat label="Total" value={total} />
      <div className="w-px h-6 bg-zinc-100" />
      <Stat label="Sent" value={totalSent} />
      <div className="w-px h-6 bg-zinc-100" />
      <Stat label="Today" value={sentToday} color="text-indigo-600" />
      <div className="w-px h-6 bg-zinc-100" />
      <Stat label="Reply" value={totalSent > 0 ? `${replyRate}%` : "--"} />
      <div className="w-px h-6 bg-zinc-100" />
      <Stat label="+" value={totalSent > 0 ? `${positiveRate}%` : "--"} color="text-green-600" />
      <div className="w-px h-6 bg-zinc-100" />
      <Stat label="-" value={totalSent > 0 ? `${negativeRate}%` : "--"} color="text-red-500" />
    </div>
  );
}

// --- AccountSelector ---

function AccountSelector({
  activeAccount,
  onAccountChange,
}: {
  activeAccount: AccountKey;
  onAccountChange: (account: AccountKey) => void;
}) {
  return (
    <div className="bg-white border-b border-zinc-200 px-3 py-2 flex gap-2">
      {ACCOUNTS.map((acc) => {
        const isActive = activeAccount === acc.key;
        return (
          <button
            key={acc.key}
            onClick={() => onAccountChange(acc.key)}
            className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-colors min-h-[36px] ${
              isActive
                ? "bg-green-600 text-white shadow-sm"
                : "bg-zinc-100 text-zinc-500 active:bg-zinc-200"
            }`}
          >
            {acc.label}
          </button>
        );
      })}
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
    <div className="bg-white border-b border-zinc-200 flex">
      {TAB_CONFIG.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = counts[tab.key];
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 flex flex-col items-center py-2 border-b-2 transition-colors min-h-[44px] ${
              isActive
                ? "border-green-600 text-green-600"
                : "border-transparent text-zinc-400"
            }`}
          >
            <span className={`text-[12px] font-semibold`}>{tab.label}</span>
            <span className={`text-[11px] ${isActive ? "text-green-400" : "text-zinc-300"}`}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

// --- Helper: check if a date string is today ---

function isToday(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dateStr.slice(0, 10) === today;
}

// --- Main WhatsAppApp ---

export default function WhatsAppApp({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) {
  const { leads: allLeads, isLoading } = useAllLeads();
  const [activeTab, setActiveTab] = useState<TabKey>("new");
  const [activeAccount, setActiveAccount] = useState<AccountKey>("number_1");

  // Filter leads for the selected account:
  // - "New" tab: leads with no senderAccount (not yet sent to anyone)
  // - Other tabs: leads assigned to the selected account
  const accountLeads = useMemo(() => {
    return allLeads.filter((l) => {
      // Leads that haven't been sent yet (no senderAccount) show in all accounts' "New" tab
      if (!l.senderAccount && !l.whatsappSentAt) return true;
      // Sent leads: only show in the account they were sent from
      return l.senderAccount === activeAccount;
    });
  }, [allLeads, activeAccount]);

  // Tab filtering (within the account-filtered leads)
  const newLeads = accountLeads.filter((l) => !l.whatsappSentAt);
  const messagedLeads = accountLeads.filter((l) => l.whatsappSentAt && !l.whatsappRepliedAt);
  const inConvoLeads = accountLeads.filter((l) => l.whatsappRepliedAt && !l.whatsappDisposition);
  const interestedLeads = accountLeads.filter((l) => l.whatsappDisposition === "interested");
  const notInterestedLeads = accountLeads.filter((l) => l.whatsappDisposition === "not_interested");

  // Stats (for this account)
  const totalSent =
    messagedLeads.length + inConvoLeads.length + interestedLeads.length + notInterestedLeads.length;
  const totalReplied =
    inConvoLeads.length + interestedLeads.length + notInterestedLeads.length;
  const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;
  const positiveRate =
    totalReplied > 0 ? Math.round((interestedLeads.length / totalReplied) * 100) : 0;
  const negativeRate =
    totalReplied > 0 ? Math.round((notInterestedLeads.length / totalReplied) * 100) : 0;

  // Sent today for this account
  const sentToday = useMemo(() => {
    return allLeads.filter(
      (l) => l.senderAccount === activeAccount && isToday(l.whatsappSentAt)
    ).length;
  }, [allLeads, activeAccount]);

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
        <span className="font-semibold text-[17px]">WhatsApp CRM</span>
        <button
          onClick={onLogout}
          className="text-sm text-zinc-500 py-1 px-2"
        >
          Logout
        </button>
      </div>

      {/* Account selector */}
      <AccountSelector activeAccount={activeAccount} onAccountChange={setActiveAccount} />

      {/* Stats bar */}
      <StatsBar
        total={accountLeads.length}
        totalSent={totalSent}
        replyRate={replyRate}
        positiveRate={positiveRate}
        negativeRate={negativeRate}
        sentToday={sentToday}
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
          <WhatsAppLeadCard key={lead.id} lead={lead} senderAccount={activeAccount} />
        ))}
      </div>
    </div>
  );
}
