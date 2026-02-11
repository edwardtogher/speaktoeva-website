import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressRingProps {
  current: number;
  target: number;
  personalBest: number | null;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  current,
  target,
  personalBest,
  size = 66,
  strokeWidth = 6,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(current / target, 1);
  const dashOffset = circumference * (1 - pct);

  const isComplete = current >= target;
  const nearPB = personalBest !== null && !isComplete && current >= personalBest - 2 && current < personalBest;

  // Color logic
  let strokeColor = "stroke-indigo-600";
  if (isComplete) strokeColor = "stroke-emerald-500";
  else if (nearPB) strokeColor = "stroke-amber-500";

  let trackColor = "stroke-gray-200";
  if (isComplete) trackColor = "stroke-emerald-100";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackColor}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={strokeColor}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
          >
            <Check className="w-5 h-5 text-emerald-500" strokeWidth={3} />
          </motion.div>
        ) : (
          <motion.span
            key={current}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-lg font-black tabular-nums text-zinc-900 leading-none"
          >
            {current}
          </motion.span>
        )}
      </div>

      {/* Near-PB pulse ring */}
      {nearPB && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-amber-400"
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
