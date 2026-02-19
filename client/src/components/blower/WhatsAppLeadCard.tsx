import { useState } from "react";
import { useUpdateWhatsapp } from "@/hooks/use-blower-api";
import type { Lead } from "@/config/blower-leads";

// --- Helpers ---

function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, "");
  if (cleaned.startsWith("07")) return "44" + cleaned.slice(1);
  if (cleaned.startsWith("447")) return cleaned;
  return cleaned;
}

function generateMessage(lead: Lead): string {
  const notes = (lead.notes || "").trim();

  // Build a personalised opener from the notes if possible
  let opener = "";
  if (notes.length > 15) {
    // Notes are written in third person — convert to second person context
    opener = `Hey! I came across ${lead.name} in ${lead.town} — ${notes.split(".")[0].toLowerCase()}.`;
  } else {
    opener = `Hey! I came across your clinic in the ${lead.town} area —`;
  }

  return `${opener} I'm based over in Farnham and I've been helping clinics like yours handle their inbound calls using AI, so when you're in sessions all day every call still gets answered and patients get booked in. Would you be up for a quick demo? No worries if not!`;
}

function getWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${formatPhoneForWhatsApp(phone)}?text=${encodeURIComponent(message)}`;
}

// --- Status pill ---

function StatusPill({ lead }: { lead: Lead }) {
  if (lead.whatsappDisposition === "interested")
    return <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">Interested</span>;
  if (lead.whatsappDisposition === "not_interested")
    return <span className="text-[11px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">Not Int.</span>;
  if (lead.whatsappRepliedAt)
    return <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">Replied</span>;
  if (lead.whatsappSentAt)
    return <span className="text-[11px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">Sent</span>;
  return <span className="text-[11px] bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">New</span>;
}

// --- Main card ---

export default function WhatsAppLeadCard({ lead }: { lead: Lead }) {
  const updateWhatsapp = useUpdateWhatsapp();
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState(() => lead.whatsappMessage || generateMessage(lead));

  const isNew = !lead.whatsappSentAt;
  const hasReplied = !!lead.whatsappRepliedAt;
  const needsDisposition = hasReplied && !lead.whatsappDisposition;

  function handleSendOnWhatsApp() {
    // Open WhatsApp with pre-filled message
    window.open(getWhatsAppUrl(lead.phone, message), "_blank");
    // Mark as sent in DB
    updateWhatsapp.mutate({
      leadId: lead.id,
      whatsappSentAt: new Date(),
      whatsappMessage: message,
    });
    setExpanded(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Card header — always visible, tap to expand new leads */}
      <div
        className={`p-4 ${isNew ? "cursor-pointer active:bg-zinc-50" : ""}`}
        onClick={() => isNew && setExpanded((e) => !e)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[15px] text-zinc-900 truncate">{lead.name}</p>
            <p className="text-[12px] text-zinc-400">{lead.town} · {lead.type}</p>
          </div>
          <StatusPill lead={lead} />
        </div>

        {/* Message sent preview */}
        {lead.whatsappMessage && !expanded && (
          <p className="mt-2 text-[12px] text-zinc-400 line-clamp-1">
            {lead.whatsappMessage}
          </p>
        )}

        {/* Reply preview */}
        {lead.whatsappReply && (
          <div className="mt-2 bg-green-50 rounded-xl p-2">
            <p className="text-[12px] text-green-700 line-clamp-2">
              <span className="font-medium">Reply: </span>{lead.whatsappReply}
            </p>
          </div>
        )}

        {/* Tap hint for new leads */}
        {isNew && !expanded && (
          <p className="mt-2 text-[11px] text-indigo-400 font-medium">Tap to message →</p>
        )}
      </div>

      {/* Expanded: message editor + send button (new leads only) */}
      {isNew && expanded && (
        <div className="px-4 pb-4 border-t border-zinc-100 pt-3">
          {/* Notes context */}
          {lead.notes && (
            <p className="text-[11px] text-zinc-400 mb-2 italic line-clamp-2">{lead.notes}</p>
          )}

          {/* Editable message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full text-[13px] text-zinc-700 bg-zinc-50 rounded-xl p-3 border border-zinc-200 resize-none focus:outline-none focus:border-indigo-400"
          />

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSendOnWhatsApp}
              className="flex-1 py-3 rounded-xl font-semibold text-[14px] text-white min-h-[48px] flex items-center justify-center gap-2 active:opacity-80"
              style={{ backgroundColor: "#25D366" }}
            >
              Open in WhatsApp
            </button>
            <button
              onClick={() => setExpanded(false)}
              className="py-3 px-4 rounded-xl bg-zinc-100 text-zinc-500 font-semibold text-[14px] min-h-[48px] active:bg-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Disposition buttons — replied leads with no outcome yet */}
      {needsDisposition && (
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={() => updateWhatsapp.mutate({ leadId: lead.id, whatsappDisposition: "interested" })}
            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold active:bg-green-700 min-h-[44px]"
          >
            Interested
          </button>
          <button
            onClick={() => updateWhatsapp.mutate({ leadId: lead.id, whatsappDisposition: "not_interested" })}
            className="flex-1 py-2.5 rounded-xl bg-zinc-100 text-zinc-600 text-sm font-semibold active:bg-zinc-200 min-h-[44px]"
          >
            Not Interested
          </button>
        </div>
      )}
    </div>
  );
}
