import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MilestoneOverlayProps {
  completed: number;
  interestedLead?: { name: string } | null;
  onInterestedDismiss?: () => void;
}

const MILESTONES: { threshold: number; message: string }[] = [
  { threshold: 10, message: "10 CALLS!" },
  { threshold: 25, message: "25! WARMING UP!" },
  { threshold: 50, message: "50! HALFWAY!" },
  { threshold: 100, message: "100! TRIPLE DIGITS!" },
  { threshold: 150, message: "150! UNSTOPPABLE!" },
  { threshold: 200, message: "200! MACHINE!" },
];

export default function MilestoneOverlay({
  completed,
  interestedLead,
  onInterestedDismiss,
}: MilestoneOverlayProps) {
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);
  const [showInterested, setShowInterested] = useState(false);
  const shownRef = useRef<Set<number>>(new Set());

  // On mount, mark all already-passed milestones as shown
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      MILESTONES.forEach((m) => {
        if (completed >= m.threshold) {
          shownRef.current.add(m.threshold);
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Milestone check
  useEffect(() => {
    const milestone = MILESTONES.find(
      (m) => completed >= m.threshold && !shownRef.current.has(m.threshold)
    );
    if (!milestone) return;

    shownRef.current.add(milestone.threshold);
    setActiveMilestone(milestone.message);

    try {
      navigator.vibrate?.([100, 50, 100, 50, 200]);
    } catch {
      // not supported
    }

    const timer = setTimeout(() => {
      setActiveMilestone(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [completed]);

  // Interested jackpot
  useEffect(() => {
    if (!interestedLead) return;

    setShowInterested(true);

    try {
      navigator.vibrate?.([200, 100, 200, 100, 300]);
    } catch {
      // not supported
    }

    const timer = setTimeout(() => {
      setShowInterested(false);
      onInterestedDismiss?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [interestedLead, onInterestedDismiss]);

  const dismissMilestone = useCallback(() => {
    setActiveMilestone(null);
  }, []);

  const dismissInterested = useCallback(() => {
    setShowInterested(false);
    onInterestedDismiss?.();
  }, [onInterestedDismiss]);

  return (
    <>
      {/* Milestone overlay */}
      <AnimatePresence>
        {activeMilestone && !showInterested && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismissMilestone}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{
                scale: [0.3, 1.15, 0.95, 1.05, 1],
                opacity: 1,
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                times: [0, 0.4, 0.6, 0.8, 1],
              }}
              className="text-center px-8"
            >
              <p className="text-5xl font-black text-white mb-2 drop-shadow-2xl">
                {activeMilestone}
              </p>
              <p className="text-zinc-500 text-sm">Tap to dismiss</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interested jackpot overlay */}
      <AnimatePresence>
        {showInterested && interestedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismissInterested}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "radial-gradient(ellipse at center, rgba(234,179,8,0.25) 0%, rgba(0,0,0,0.85) 70%)",
            }}
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 0, rotate: -5 }}
              animate={{
                scale: [0.2, 1.2, 0.9, 1.1, 1],
                opacity: 1,
                rotate: [-5, 3, -2, 1, 0],
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                times: [0, 0.35, 0.55, 0.75, 1],
              }}
              className="text-center px-8"
            >
              <p className="text-6xl mb-3">🎯</p>
              <p className="text-4xl font-black text-yellow-400 mb-2 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                INTERESTED!
              </p>
              <p className="text-lg text-yellow-200/70 font-medium">
                {interestedLead.name}
              </p>
              <p className="text-zinc-500 text-sm mt-3">Tap to dismiss</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
