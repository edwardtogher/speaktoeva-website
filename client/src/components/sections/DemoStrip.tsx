import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

// Thin recurring conversion strip — points at the lead-capture form
export default function DemoStrip({ label }: { label: string }) {
  return (
    <AnimateOnScroll>
      <a
        href="/#demo"
        className="block border-y border-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors group"
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-5 flex items-center justify-between gap-4">
          <span className="font-display font-bold text-lg sm:text-xl">{label}</span>
          <span className="microlabel text-primary group-hover:text-primary-foreground whitespace-nowrap">
            Get your free demo →
          </span>
        </div>
      </a>
    </AnimateOnScroll>
  );
}
