import { AnimatePresence, motion } from "framer-motion";

interface PBBannerProps {
  todayCalls: number;
  personalBest: { calls: number; date: string } | null;
}

export default function PBBanner({ todayCalls, personalBest }: PBBannerProps) {
  const pb = personalBest?.calls ?? 0;

  // No personal best yet, or too far away
  if (!personalBest || pb === 0) return null;

  const diff = pb - todayCalls;

  let content: string | null = null;
  let style: "gold" | "amber" | "subtle" | null = null;

  if (diff <= 0) {
    // New PB!
    content = "NEW PERSONAL BEST!";
    style = "gold";
  } else if (diff === 1) {
    content = "1 more call to beat your PB!";
    style = "amber";
  } else if (diff === 2) {
    content = "2 away from your PB!";
    style = "subtle";
  } else if (diff === 3) {
    content = "Almost at your PB!";
    style = "subtle";
  }

  if (!content || !style) return null;

  const styleClasses = {
    gold: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-900",
    amber: "bg-amber-50 border border-amber-200 text-amber-700",
    subtle: "bg-zinc-50 border border-zinc-200 text-zinc-600",
  };

  return (
    <AnimatePresence>
      <motion.div
        key={`pb-${diff <= 0 ? "new" : diff}`}
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{ opacity: 1, height: "auto", marginTop: 0 }}
        exit={{ opacity: 0, height: 0, marginTop: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <motion.div
          className={`mx-4 mt-2 px-4 py-2.5 rounded-xl text-center text-sm font-bold ${styleClasses[style]}`}
          {...(style === "gold"
            ? {
                animate: { scale: [1, 1.02, 1] },
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }
            : style === "amber"
            ? {
                animate: { opacity: [1, 0.7, 1] },
                transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
              }
            : {})}
        >
          {style === "gold" && <span className="mr-1.5">&#127942;</span>}
          {content}
          {style === "gold" && <span className="ml-1.5">&#127942;</span>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
