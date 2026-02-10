import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const metrics = [
  { value: '62M+', label: 'Calls on our infrastructure' },
  { value: '<1s', label: 'Average response time' },
  { value: '24/7', label: 'Always available' },
  { value: '99.9%', label: 'Uptime guarantee' },
];

function Metric({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-4xl sm:text-5xl font-bold text-primary">{value}</div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export default function SocialProof() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Built on infrastructure that handles millions.
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <Metric key={m.label} value={m.value} label={m.label} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
