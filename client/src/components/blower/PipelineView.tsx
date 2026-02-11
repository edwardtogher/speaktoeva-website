import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone } from "lucide-react";
import type { Lead } from "@/config/blower-leads";
import type { PipelineStage } from "@/hooks/use-blower-store";

interface PipelineViewProps {
  leads: Lead[];
  stages: Record<string, PipelineStage>;
  notes: Record<string, string>;
  onSetStage: (leadId: string, stage: PipelineStage) => void;
  onBack: () => void;
}

interface StageConfig {
  key: PipelineStage;
  label: string;
  emoji: string;
  description: string;
  colorText: string;
  advanceLabel?: string;
  advanceTo?: PipelineStage;
  advanceBg: string;
  advanceText: string;
  alwaysShow: boolean;
}

const STAGE_CONFIGS: StageConfig[] = [
  {
    key: "send_demo",
    label: "Send Demo",
    emoji: "\ud83d\udcf1",
    description: "Build and send the personalised demo",
    colorText: "text-amber-600",
    advanceLabel: "Demo sent",
    advanceTo: "demo_sent",
    advanceBg: "bg-amber-100",
    advanceText: "text-amber-700",
    alwaysShow: true,
  },
  {
    key: "demo_sent",
    label: "Demo Sent",
    emoji: "\u2709\ufe0f",
    description: "Chase for a reply",
    colorText: "text-blue-600",
    advanceLabel: "Booked",
    advanceTo: "booked",
    advanceBg: "bg-blue-100",
    advanceText: "text-blue-700",
    alwaysShow: true,
  },
  {
    key: "booked",
    label: "Booked",
    emoji: "\ud83d\udcc5",
    description: "Meeting scheduled",
    colorText: "text-purple-600",
    advanceLabel: "Won!",
    advanceTo: "won",
    advanceBg: "bg-purple-100",
    advanceText: "text-purple-700",
    alwaysShow: false,
  },
  {
    key: "won",
    label: "Won",
    emoji: "\ud83c\udfc6",
    description: "Signed up!",
    colorText: "text-green-600",
    advanceBg: "",
    advanceText: "",
    alwaysShow: false,
  },
];

export default function PipelineView({
  leads,
  stages,
  notes,
  onSetStage,
  onBack,
}: PipelineViewProps) {
  // Group leads by stage
  const grouped: Record<PipelineStage, Lead[]> = {
    send_demo: [],
    demo_sent: [],
    booked: [],
    won: [],
  };

  for (const lead of leads) {
    const stage = stages[lead.id] || "send_demo";
    grouped[stage].push(lead);
  }

  // Swipe-back gesture (same pattern as HistoryView)
  const [swipeX, setSwipeX] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX <= 50) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      isSwipingRef.current = false;
    } else {
      touchStartRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    if (dx > 10 && dx > dy) {
      isSwipingRef.current = true;
      setSwipeX(Math.min(dx, 300));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    touchStartRef.current = null;
    if (isSwipingRef.current && swipeX > 100) {
      setSwipeX(400);
      setTimeout(onBack, 150);
    } else {
      setSwipeX(0);
    }
    isSwipingRef.current = false;
  }, [swipeX, onBack]);

  // Determine which sections to show
  const visibleStages = STAGE_CONFIGS.filter(
    (s) => s.alwaysShow || grouped[s.key].length > 0
  );

  return (
    <div
      className="min-h-[100dvh] bg-[#F2F2F7] text-zinc-900 flex flex-col"
      style={{
        fontFamily: "'Inter', sans-serif",
        transform: swipeX > 0 ? `translateX(${swipeX}px)` : undefined,
        transition: isSwipingRef.current ? "none" : "transform 0.2s ease-out",
        opacity: swipeX > 0 ? 1 - swipeX / 500 : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-zinc-900">Pipeline</h1>
          <span className="text-sm text-zinc-400 ml-1">
            {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Scrollable stage sections */}
      <div className="flex-1 overflow-y-auto pb-[max(env(safe-area-inset-bottom),24px)]">
        {leads.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-zinc-400 text-lg">No leads in the pipeline yet</p>
          </div>
        ) : (
          visibleStages.map((stageConfig, sectionIdx) => {
            const stageLeads = grouped[stageConfig.key];
            return (
              <div key={stageConfig.key}>
                {/* Stage header */}
                <h3
                  className={`text-lg font-bold ${stageConfig.colorText} flex items-center gap-2 px-4 pt-4 pb-2`}
                >
                  <span>{stageConfig.emoji}</span> {stageConfig.label}
                  <span className="text-sm font-normal text-zinc-400">
                    {stageLeads.length}
                  </span>
                </h3>

                {/* Stage description */}
                <p className="text-xs text-zinc-400 px-4 pb-2">
                  {stageConfig.description}
                </p>

                {/* Lead cards or empty state */}
                <div className="px-4 space-y-2 pb-2">
                  {stageLeads.length > 0 ? (
                    stageLeads.map((lead, idx) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIdx * 0.05 + idx * 0.03 }}
                        className="rounded-2xl bg-white border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-3.5"
                      >
                        <div className="flex items-center gap-3">
                          {/* Phone icon */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center active:bg-green-100 transition-colors"
                            aria-label={`Call ${lead.name}`}
                          >
                            <Phone className="w-4 h-4 text-green-600" />
                          </a>

                          {/* Lead info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-zinc-900 truncate">
                              {lead.name}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {lead.town}
                            </p>
                            {notes[lead.id] && (
                              <p className="text-xs text-zinc-400 truncate mt-0.5">
                                {notes[lead.id]}
                              </p>
                            )}
                          </div>

                          {/* Advance button */}
                          {stageConfig.advanceTo && (
                            <button
                              onClick={() =>
                                onSetStage(lead.id, stageConfig.advanceTo!)
                              }
                              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${stageConfig.advanceBg} ${stageConfig.advanceText} active:opacity-70 transition-opacity`}
                            >
                              {stageConfig.advanceLabel}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 py-2 px-1">
                      No leads at this stage
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
