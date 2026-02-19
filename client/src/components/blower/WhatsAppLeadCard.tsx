import { useUpdateWhatsapp } from "@/hooks/use-blower-api";
import type { Lead } from "@/config/blower-leads";

function StatusPill({ lead }: { lead: Lead }) {
  if (lead.whatsappDisposition === "interested")
    return (
      <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
        Interested
      </span>
    );
  if (lead.whatsappDisposition === "not_interested")
    return (
      <span className="text-[11px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
        Not Int.
      </span>
    );
  if (lead.whatsappRepliedAt)
    return (
      <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
        In Convo
      </span>
    );
  if (lead.whatsappSentAt)
    return (
      <span className="text-[11px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
        Sent
      </span>
    );
  return (
    <span className="text-[11px] bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
      New
    </span>
  );
}

export default function WhatsAppLeadCard({ lead }: { lead: Lead }) {
  const updateWhatsapp = useUpdateWhatsapp();

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
      {/* Name + town */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-[15px] text-zinc-900">{lead.name}</p>
          <p className="text-[12px] text-zinc-400">
            {lead.town} · {lead.type}
          </p>
        </div>
        <StatusPill lead={lead} />
      </div>

      {/* WhatsApp message sent */}
      {lead.whatsappMessage && (
        <div className="mt-2 text-[12px] text-zinc-500 bg-zinc-50 rounded-xl p-2 line-clamp-2">
          <span className="font-medium text-zinc-600">Sent: </span>
          {lead.whatsappMessage}
        </div>
      )}

      {/* Their reply */}
      {lead.whatsappReply && (
        <div className="mt-1.5 text-[12px] text-zinc-700 bg-green-50 rounded-xl p-2 line-clamp-3">
          <span className="font-medium text-green-700">Reply: </span>
          {lead.whatsappReply}
        </div>
      )}

      {/* Disposition buttons — only if replied and no disposition set */}
      {lead.whatsappRepliedAt && !lead.whatsappDisposition && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() =>
              updateWhatsapp.mutate({
                leadId: lead.id,
                whatsappDisposition: "interested",
              })
            }
            className="flex-1 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold active:bg-green-700 min-h-[44px]"
          >
            Interested
          </button>
          <button
            onClick={() =>
              updateWhatsapp.mutate({
                leadId: lead.id,
                whatsappDisposition: "not_interested",
              })
            }
            className="flex-1 py-2 rounded-xl bg-zinc-100 text-zinc-600 text-sm font-semibold active:bg-zinc-200 min-h-[44px]"
          >
            Not Interested
          </button>
        </div>
      )}

      {/* Phone number */}
      <p className="text-[11px] text-zinc-300 mt-2">{lead.phone}</p>
    </div>
  );
}
