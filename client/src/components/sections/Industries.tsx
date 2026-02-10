import { Wrench, Sparkles, Scale, Home, Car, Briefcase } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const industries = [
  {
    icon: Wrench,
    title: 'Trades & Home Services',
    description: 'Plumbers, electricians, HVAC — never miss a job while you\'re on-site.',
  },
  {
    icon: Sparkles,
    title: 'Med Spas & Clinics',
    description: 'Book consultations and answer treatment questions automatically.',
  },
  {
    icon: Scale,
    title: 'Legal Firms',
    description: 'Qualify leads and schedule initial consultations without a receptionist.',
  },
  {
    icon: Home,
    title: 'Estate Agents',
    description: 'Capture viewing requests and property enquiries around the clock.',
  },
  {
    icon: Car,
    title: 'Auto Services',
    description: 'Book MOTs, servicing, and repairs while your team focuses on the workshop.',
  },
  {
    icon: Briefcase,
    title: 'Any Service Business',
    description: 'If your business lives on the phone, EVA is built for you.',
  },
];

export default function Industries() {
  return (
    <section id="industries" className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Built for businesses that live on the phone.
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <AnimateOnScroll key={ind.title}>
                <div className="bg-background border rounded-lg p-6 space-y-4 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{ind.title}</h3>
                  <p className="text-muted-foreground text-sm">{ind.description}</p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
