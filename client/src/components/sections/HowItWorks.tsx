import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const steps = [
  {
    num: '01',
    title: 'A customer calls',
    description: 'Eva picks up instantly — no hold music, no voicemail, no missed opportunity.',
  },
  {
    num: '02',
    title: 'Eva handles the conversation',
    description: 'She greets them naturally, answers questions, and books appointments on the spot.',
  },
  {
    num: '03',
    title: 'You get notified',
    description: 'A call summary, any booked appointments, and follow-up actions — instantly.',
  },
];

// Procedure ledger: numbered hairline rows, no icons, no cards
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 lg:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display font-extrabold uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              How Eva works
            </h2>
            <span className="microlabel text-foreground/40 hidden sm:inline">Procedure — 3 steps</span>
          </div>
        </AnimateOnScroll>

        <div className="border-t border-foreground/10">
          {steps.map((step) => (
            <AnimateOnScroll key={step.num}>
              <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[6rem_1fr_1fr] gap-4 sm:gap-8 items-baseline border-b border-foreground/10 py-8 group">
                <span className="font-mono text-sm text-primary font-bold">{step.num}</span>
                <h3 className="font-display font-bold text-xl sm:text-2xl group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base col-start-2 sm:col-start-3">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
