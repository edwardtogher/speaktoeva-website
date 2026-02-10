import { Phone, MessageSquare, BellRing } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const steps = [
  {
    num: 1,
    icon: Phone,
    title: 'A customer calls',
    description: 'EVA picks up instantly — no hold music, no voicemail, no missed opportunity.',
  },
  {
    num: 2,
    icon: MessageSquare,
    title: 'EVA handles the conversation',
    description: 'She greets them naturally, answers questions, and books appointments on the spot.',
  },
  {
    num: 3,
    icon: BellRing,
    title: 'You get notified',
    description: 'You receive a call summary, any booked appointments, and follow-up actions — instantly.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <AnimateOnScroll>
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold">How EVA works</h2>
            <p className="text-lg text-muted-foreground">Three steps. Zero missed calls.</p>
          </div>
        </AnimateOnScroll>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Dashed connecting line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] border-t-2 border-dashed border-border" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <AnimateOnScroll key={step.num}>
                <div className="relative flex flex-col items-center text-center space-y-4">
                  {/* Numbered circle */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 md:static md:mt-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground max-w-xs">{step.description}</p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
