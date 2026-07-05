import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const features = [
  {
    num: 'A1',
    title: 'Answers every call',
    description: 'No more voicemail. Eva picks up 24/7 so you never miss a lead.',
  },
  {
    num: 'A2',
    title: 'Books appointments',
    description: 'Checks your calendar and books slots in real time, mid-call.',
  },
  {
    num: 'A3',
    title: 'Sends follow-ups',
    description: 'Texts or emails callers with confirmations and next steps.',
  },
  {
    num: 'B1',
    title: 'Call summaries',
    description: 'Every call summarised and sent straight to you — nothing to listen back to.',
  },
  {
    num: 'B2',
    title: 'Handles emails & texts',
    description: 'Responds to SMS and email enquiries in the same natural tone.',
  },
  {
    num: 'B3',
    title: 'Integrates with your tools',
    description: 'CRM, calendar, Slack and more — zero manual data entry.',
  },
];

// Capability index: two-column manifest, hairlines, no icon cards
export default function Features() {
  return (
    <section id="features" className="px-4 lg:px-8 py-24 bg-primary/[0.03]">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display font-extrabold uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-2xl">
              Everything your receptionist does. <span className="text-primary">And more.</span>
            </h2>
            <span className="microlabel text-foreground/40 hidden sm:inline">Index — capabilities</span>
          </div>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 border-t border-l border-foreground/10">
          {features.map((f) => (
            <AnimateOnScroll key={f.num}>
              <div className="border-b border-r border-foreground/10 p-6 lg:p-8 h-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200 group">
                <span className="font-mono text-xs text-primary group-hover:text-primary-foreground/70 font-bold">
                  {f.num}
                </span>
                <h3 className="font-display font-bold text-xl mt-3">{f.title}</h3>
                <p className="text-muted-foreground group-hover:text-primary-foreground/80 text-sm mt-2">
                  {f.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
