import { Phone, CalendarCheck, Send, FileText, Mail, Plug } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const features = [
  {
    icon: Phone,
    title: 'Answers every call',
    description: 'No more voicemail. EVA picks up 24/7 so you never miss a lead.',
  },
  {
    icon: CalendarCheck,
    title: 'Books appointments',
    description: 'Checks your calendar and books slots in real-time during the call.',
  },
  {
    icon: Send,
    title: 'Sends follow-ups',
    description: 'Automatically texts or emails callers with confirmations and next steps.',
  },
  {
    icon: FileText,
    title: 'Call summaries',
    description: 'Every call is summarised and sent straight to you — no need to listen back.',
  },
  {
    icon: Mail,
    title: 'Handles emails & texts',
    description: 'Responds to SMS and email enquiries with the same natural tone.',
  },
  {
    icon: Plug,
    title: 'Integrates with your tools',
    description: 'Connects to your CRM, calendar, Slack, and more — zero manual data entry.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Everything your receptionist does. And more.
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <AnimateOnScroll key={f.title}>
                <div className="bg-background border rounded-lg p-6 space-y-4 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
