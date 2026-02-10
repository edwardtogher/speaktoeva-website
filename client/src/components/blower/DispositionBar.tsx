import { PhoneMissed, ThumbsUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Disposition } from "@/hooks/use-blower-store";

interface DispositionBarProps {
  active: Disposition | null;
  onSelect: (disposition: Disposition) => void;
}

const BUTTONS: {
  key: Disposition;
  label: string;
  icon: React.ElementType;
  baseClass: string;
  activeClass: string;
}[] = [
  {
    key: "no_answer",
    label: "No Answer",
    icon: PhoneMissed,
    baseClass: "bg-zinc-800/80 border-zinc-700/50 text-zinc-300",
    activeClass: "bg-zinc-600 border-zinc-500 text-white ring-2 ring-zinc-400/30",
  },
  {
    key: "interested",
    label: "Interested",
    icon: ThumbsUp,
    baseClass: "bg-green-950/50 border-green-800/40 text-green-400",
    activeClass: "bg-green-600 border-green-500 text-white ring-2 ring-green-400/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
  },
  {
    key: "not_interested",
    label: "Not Interested",
    icon: X,
    baseClass: "bg-red-950/30 border-red-800/30 text-red-400",
    activeClass: "bg-red-600 border-red-500 text-white ring-2 ring-red-400/30",
  },
];

export default function DispositionBar({ active, onSelect }: DispositionBarProps) {
  return (
    <div className="flex gap-2">
      {BUTTONS.map(({ key, label, icon: Icon, baseClass, activeClass }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 min-h-[60px] rounded-xl border font-semibold transition-all active:scale-95",
              isActive ? activeClass : baseClass
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[12px] leading-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
