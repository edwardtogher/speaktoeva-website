import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const metrics = [
  { value: '62M+', label: 'Calls on our infrastructure' },
  { value: '<1s', label: 'Average response time' },
  { value: '24/7', label: 'Always available' },
  { value: '99.9%', label: 'Uptime guarantee' },
];

// Telemetry band: one hairline-ruled row of instrument readings
export default function SocialProof() {
  return (
    <section className="border-y border-foreground/10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <AnimateOnScroll key={m.label}>
            <div
              className={`px-4 lg:px-8 py-8 lg:py-10 border-foreground/10 ${
                i > 0 ? 'lg:border-l' : ''
              } ${i % 2 === 1 ? 'border-l lg:border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''}`}
            >
              <div className="font-display font-extrabold text-4xl lg:text-5xl text-primary">
                {m.value}
              </div>
              <p className="microlabel text-foreground/50 mt-3">{m.label}</p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
