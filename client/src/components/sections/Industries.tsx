import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const industries = [
  ['Trades & home services', 'Never miss a job while you\'re on-site.'],
  ['Med spas & clinics', 'Consultations booked, treatment questions answered.'],
  ['Legal firms', 'Leads qualified, consultations scheduled.'],
  ['Estate agents', 'Viewing requests captured around the clock.'],
  ['Auto services', 'MOTs and repairs booked while the workshop works.'],
  ['Any service business', 'If your business lives on the phone, Eva is built for you.'],
];

// Deployment register: compact hairline rows
export default function Industries() {
  return (
    <section id="industries" className="px-4 lg:px-8 py-24">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
        <AnimateOnScroll>
          <div className="lg:sticky lg:top-24">
            <span className="microlabel text-foreground/40">Deployments</span>
            <h2 className="font-display font-extrabold uppercase text-3xl sm:text-4xl tracking-tight mt-4">
              Built for businesses that live on the phone.
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="border-t border-foreground/10">
          {industries.map(([title, desc], i) => (
            <AnimateOnScroll key={title}>
              <div className="grid sm:grid-cols-[2.5rem_1fr_1.2fr] gap-2 sm:gap-6 items-baseline border-b border-foreground/10 py-5">
                <span className="font-mono text-xs text-primary font-bold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display font-bold text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
