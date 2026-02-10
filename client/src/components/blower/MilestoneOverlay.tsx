import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MilestoneOverlayProps {
  completed: number;
}

const MILESTONES: { threshold: number; message: string }[] = [
  { threshold: 10, message: "10 CALLS!" },
  { threshold: 25, message: "25! WARMING UP!" },
  { threshold: 50, message: "50! HALFWAY!" },
  { threshold: 100, message: "100! TRIPLE DIGITS!" },
  { threshold: 150, message: "150! UNSTOPPABLE!" },
  { threshold: 200, message: "200! MACHINE!" },
];

export default function MilestoneOverlay({ completed }: MilestoneOverlayProps) {
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);
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

  useEffect(() => {
    const milestone = MILESTONES.find(
      (m) => completed >= m.threshold && !shownRef.current.has(m.threshold)
    );
    if (!milestone) return;

    shownRef.current.add(milestone.threshold);
    setActiveMilestone(milestone.message);

    // Vibrate
    try {
      navigator.vibrate?.([100, 50, 100, 50, 200]);
    } catch {
      // not supported
    }

    // Auto-dismiss after 2.5s
    const timer = setTimeout(() => {
      setActiveMilestone(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [completed]);

  const dismiss = useCallback(() => {
    setActiveMilestone(null);
  }, []);

  return (
    <AnimatePresence>
      {activeMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={dismiss}
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
  );
}
