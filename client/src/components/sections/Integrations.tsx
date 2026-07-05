import {
  SiGooglecalendar,
  SiSlack,
  SiHubspot,
  SiCalendly,
  SiZapier,
  SiWhatsapp,
  SiGmail,
} from 'react-icons/si';
import { MessageSquare, Mail } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const integrations = [
  { name: 'Google Calendar', icon: SiGooglecalendar },
  { name: 'Slack', icon: SiSlack },
  { name: 'HubSpot', icon: SiHubspot },
  { name: 'Calendly', icon: SiCalendly },
  { name: 'Zapier', icon: SiZapier },
  { name: 'WhatsApp', icon: SiWhatsapp },
  { name: 'SMS', icon: MessageSquare },
  { name: 'Gmail', icon: SiGmail },
  { name: 'Outlook', icon: Mail },
];

// Interface panel: monochrome plug-board of square tiles
export default function Integrations() {
  return (
    <section id="integrations" className="px-4 lg:px-8 py-24 bg-primary/[0.03]">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display font-extrabold uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Plugs into your stack.
            </h2>
            <span className="microlabel text-foreground/40 hidden sm:inline">Interfaces</span>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="flex flex-wrap border-t border-l border-foreground/10">
            {integrations.map((int) => {
              const Icon = int.icon;
              return (
                <div
                  key={int.name}
                  className="flex items-center gap-3 border-b border-r border-foreground/10 px-5 py-4 font-mono text-xs uppercase tracking-[0.12em] text-foreground/70 hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {int.name}
                </div>
              );
            })}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <p className="text-muted-foreground text-sm mt-6 max-w-xl">
            Calendar, CRM, messaging, email — Eva slots into the workflow you already run, with zero manual data entry.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
