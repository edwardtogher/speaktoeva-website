import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone } from "lucide-react";
import type { Lead } from "@/config/blower-leads";
import type { PipelineStage } from "@/hooks/use-blower-store";

interface PipelineViewProps {
  leads: Lead[];
  stages: Record<string, PipelineStage>;
  notes: Record<string, string>;
  onSetStage: (leadId: string, stage: PipelineStage) => void;
  onBack: () => void;
  /** When true, renders without sticky header, back button, or swipe-back gesture */
  embedded?: boolean;
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
  /** Highlight color for drop zone (Tailwind bg class) */
  dropHighlight: string;
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
    dropHighlight: "bg-amber-50",
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
    dropHighlight: "bg-blue-50",
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
    dropHighlight: "bg-purple-50",
    alwaysShow: true,
  },
  {
    key: "won",
    label: "Won",
    emoji: "\ud83c\udfc6",
    description: "Signed up!",
    colorText: "text-green-600",
    advanceBg: "",
    advanceText: "",
    dropHighlight: "bg-green-50",
    alwaysShow: true,
  },
];

/** How far a finger can move during the 300ms hold before we cancel the drag */
const LONG_PRESS_MOVE_THRESHOLD = 10;
/** How long to hold before drag activates */
const LONG_PRESS_DURATION = 300;

interface DragState {
  leadId: string;
  sourceStage: PipelineStage;
  /** Current finger position (viewport coords) */
  currentX: number;
  currentY: number;
  /** Offset from card top-left to finger position */
  offsetX: number;
  offsetY: number;
  /** Width/height of the original card for the clone */
  cardWidth: number;
  cardHeight: number;
  /** The stage the finger is currently hovering over */
  hoverStage: PipelineStage | null;
}

export default function PipelineView({
  leads,
  stages,
  notes,
  onSetStage,
  onBack,
  embedded = false,
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

  // ── Swipe-back gesture ──────────────────────────────────────────────
  const [swipeX, setSwipeX] = useState(0);
  const swipeTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);

  const handleSwipeTouchStart = useCallback((x: number, y: number) => {
    if (x <= 50) {
      swipeTouchStartRef.current = { x, y };
      isSwipingRef.current = false;
    } else {
      swipeTouchStartRef.current = null;
    }
  }, []);

  const handleSwipeTouchMove = useCallback((x: number, y: number) => {
    if (!swipeTouchStartRef.current) return;
    const dx = x - swipeTouchStartRef.current.x;
    const dy = Math.abs(y - swipeTouchStartRef.current.y);
    if (dx > 10 && dx > dy) {
      isSwipingRef.current = true;
      setSwipeX(Math.min(dx, 300));
    }
  }, []);

  const handleSwipeTouchEnd = useCallback(() => {
    if (!swipeTouchStartRef.current) return;
    swipeTouchStartRef.current = null;
    if (isSwipingRef.current && swipeX > 100) {
      setSwipeX(400);
      setTimeout(onBack, 150);
    } else {
      setSwipeX(0);
    }
    isSwipingRef.current = false;
  }, [swipeX, onBack]);

  // ── Touch-based drag and drop ───────────────────────────────────────
  const [dragState, setDragState] = useState<DragState | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTouchRef = useRef<{
    leadId: string;
    sourceStage: PipelineStage;
    startX: number;
    startY: number;
    cardEl: HTMLElement;
  } | null>(null);
  /** Refs to the stage section DOM elements for hit-testing */
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  /** Track if we just finished a drag, to suppress the next click */
  const justDraggedRef = useRef(false);

  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTouchRef.current = null;
  }, []);

  /** Given viewport coordinates, return which PipelineStage the point is over (or null) */
  const hitTestStage = useCallback((clientX: number, clientY: number): PipelineStage | null => {
    for (const config of STAGE_CONFIGS) {
      const el = stageRefs.current[config.key];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        clientX >= rect.left &&
        clientX <= rect.right
      ) {
        return config.key;
      }
    }
    return null;
  }, []);

  const onCardTouchStart = useCallback(
    (e: React.TouchEvent, leadId: string, sourceStage: PipelineStage) => {
      const touch = e.touches[0];
      // Don't interfere with swipe-back (left 50px edge)
      if (touch.clientX <= 50) return;

      const cardEl = e.currentTarget as HTMLElement;
      longPressTouchRef.current = {
        leadId,
        sourceStage,
        startX: touch.clientX,
        startY: touch.clientY,
        cardEl,
      };

      longPressTimerRef.current = setTimeout(() => {
        const info = longPressTouchRef.current;
        if (!info) return;

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(20);
        }

        const rect = info.cardEl.getBoundingClientRect();
        setDragState({
          leadId: info.leadId,
          sourceStage: info.sourceStage,
          currentX: info.startX,
          currentY: info.startY,
          offsetX: info.startX - rect.left,
          offsetY: info.startY - rect.top,
          cardWidth: rect.width,
          cardHeight: rect.height,
          hoverStage: info.sourceStage,
        });
        justDraggedRef.current = true;
        longPressTouchRef.current = null;
      }, LONG_PRESS_DURATION);
    },
    []
  );

  const onCardTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];

      // If still in long-press detection phase, check if finger moved too much
      if (longPressTouchRef.current) {
        const dx = Math.abs(touch.clientX - longPressTouchRef.current.startX);
        const dy = Math.abs(touch.clientY - longPressTouchRef.current.startY);
        if (dx > LONG_PRESS_MOVE_THRESHOLD || dy > LONG_PRESS_MOVE_THRESHOLD) {
          cancelLongPress();
        }
        return;
      }

      // If actively dragging, update the position
      if (dragState) {
        e.preventDefault(); // prevent scroll while dragging
        const hoverStage = hitTestStage(touch.clientX, touch.clientY);
        setDragState((prev) =>
          prev
            ? {
                ...prev,
                currentX: touch.clientX,
                currentY: touch.clientY,
                hoverStage,
              }
            : null
        );
      }
    },
    [dragState, cancelLongPress, hitTestStage]
  );

  const onCardTouchEnd = useCallback(() => {
    cancelLongPress();

    if (dragState) {
      const { leadId, sourceStage, hoverStage } = dragState;
      if (hoverStage && hoverStage !== sourceStage) {
        onSetStage(leadId, hoverStage);
      }
      setDragState(null);
      // Keep justDraggedRef true for a short time to suppress tap
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 100);
    }
  }, [dragState, cancelLongPress, onSetStage]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // ── Container touch handler that dispatches to swipe-back ───────────
  const onContainerTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleSwipeTouchStart(touch.clientX, touch.clientY);
    },
    [handleSwipeTouchStart]
  );

  const onContainerTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleSwipeTouchMove(touch.clientX, touch.clientY);
    },
    [handleSwipeTouchMove]
  );

  const onContainerTouchEnd = useCallback(() => {
    handleSwipeTouchEnd();
  }, [handleSwipeTouchEnd]);

  return (
    <div
      className={embedded ? "bg-[#F2F2F7] text-zinc-900 flex flex-col" : "min-h-[100dvh] bg-[#F2F2F7] text-zinc-900 flex flex-col"}
      style={{
        fontFamily: "'Inter', sans-serif",
        ...(!embedded && swipeX > 0
          ? {
              transform: `translateX(${swipeX}px)`,
              transition: isSwipingRef.current ? "none" : "transform 0.2s ease-out",
              opacity: 1 - swipeX / 500,
            }
          : {}),
      }}
      {...(!embedded
        ? {
            onTouchStart: onContainerTouchStart,
            onTouchMove: onContainerTouchMove,
            onTouchEnd: onContainerTouchEnd,
          }
        : {})}
    >
      {/* Sticky header — only in standalone mode */}
      {!embedded && (
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
      )}

      {/* Scrollable stage sections */}
      <div className={embedded ? "pb-6" : "flex-1 overflow-y-auto pb-[max(env(safe-area-inset-bottom),24px)]"}>
        {leads.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-zinc-400 text-lg">No leads in the pipeline yet</p>
          </div>
        ) : (
          STAGE_CONFIGS.map((stageConfig, sectionIdx) => {
            const stageLeads = grouped[stageConfig.key];
            const isDropTarget =
              dragState !== null && dragState.hoverStage === stageConfig.key;
            const isSourceStage =
              dragState !== null && dragState.sourceStage === stageConfig.key;

            return (
              <div
                key={stageConfig.key}
                ref={(el) => {
                  stageRefs.current[stageConfig.key] = el;
                }}
                className={`transition-colors duration-150 ${
                  isDropTarget && !isSourceStage ? stageConfig.dropHighlight : ""
                }`}
              >
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
                  <AnimatePresence mode="popLayout">
                    {stageLeads.length > 0 ? (
                      stageLeads.map((lead, idx) => {
                        const isDraggedCard =
                          dragState !== null && dragState.leadId === lead.id;

                        return (
                          <motion.div
                            key={lead.id}
                            layout
                            layoutId={`pipeline-card-${lead.id}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{
                              opacity: isDraggedCard ? 0.35 : 1,
                              y: 0,
                              scale: isDraggedCard ? 0.97 : 1,
                            }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{
                              layout: { type: "spring", stiffness: 400, damping: 30 },
                              delay:
                                !dragState && !isDraggedCard
                                  ? sectionIdx * 0.05 + idx * 0.03
                                  : 0,
                            }}
                            className="rounded-2xl bg-white border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-3.5 touch-manipulation"
                            onTouchStart={(e) =>
                              onCardTouchStart(e, lead.id, stageConfig.key)
                            }
                            onTouchMove={onCardTouchMove}
                            onTouchEnd={onCardTouchEnd}
                          >
                            <div className="flex items-center gap-3">
                              {/* Phone icon */}
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center active:bg-green-100 transition-colors"
                                aria-label={`Call ${lead.name}`}
                                onClick={(e) => {
                                  if (justDraggedRef.current) {
                                    e.preventDefault();
                                  }
                                }}
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
                                  onClick={(e) => {
                                    if (justDraggedRef.current) {
                                      e.preventDefault();
                                      return;
                                    }
                                    onSetStage(lead.id, stageConfig.advanceTo!);
                                  }}
                                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${stageConfig.advanceBg} ${stageConfig.advanceText} active:opacity-70 transition-opacity`}
                                >
                                  {stageConfig.advanceLabel}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.p
                        key={`empty-${stageConfig.key}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-zinc-400 py-2 px-1"
                      >
                        No leads at this stage
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating drag clone */}
      {dragState && (
        <DragClone dragState={dragState} leads={leads} notes={notes} stages={stages} />
      )}
    </div>
  );
}

// ── Floating clone that follows the finger ────────────────────────────

function DragClone({
  dragState,
  leads,
  notes,
}: {
  dragState: DragState;
  leads: Lead[];
  notes: Record<string, string>;
  stages: Record<string, PipelineStage>;
}) {
  const lead = leads.find((l) => l.id === dragState.leadId);
  if (!lead) return null;

  const stageConfig = STAGE_CONFIGS.find((s) => s.key === dragState.sourceStage);

  const x = dragState.currentX - dragState.offsetX;
  const y = dragState.currentY - dragState.offsetY;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: x,
        top: y,
        width: dragState.cardWidth,
        transform: "scale(1.03)",
        opacity: 0.9,
      }}
    >
      <div className="rounded-2xl bg-white border border-gray-100/50 shadow-xl px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <Phone className="w-4 h-4 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-zinc-900 truncate">{lead.name}</p>
            <p className="text-xs text-zinc-400 truncate">{lead.town}</p>
            {notes[lead.id] && (
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                {notes[lead.id]}
              </p>
            )}
          </div>
          {stageConfig?.advanceTo && (
            <div
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${stageConfig.advanceBg} ${stageConfig.advanceText}`}
            >
              {stageConfig.advanceLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
