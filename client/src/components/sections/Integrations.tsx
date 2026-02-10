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
  { name: 'Google Calendar', icon: SiGooglecalendar, color: 'text-blue-600' },
  { name: 'Slack', icon: SiSlack, color: 'text-purple-600' },
  { name: 'HubSpot', icon: SiHubspot, color: 'text-orange-500' },
  { name: 'Calendly', icon: SiCalendly, color: 'text-blue-500' },
  { name: 'Zapier', icon: SiZapier, color: 'text-orange-500' },
  { name: 'WhatsApp', icon: SiWhatsapp, color: 'text-green-500' },
  { name: 'SMS', icon: MessageSquare, color: 'text-muted-foreground' },
  { name: 'Gmail', icon: SiGmail, color: 'text-red-500' },
  { name: 'Outlook', icon: Mail, color: 'text-blue-600' },
];

export default function Integrations() {
  return (
    <section id="integrations" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Works with the tools you already use.
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {integrations.map((int) => {
              const Icon = int.icon;
              return (
                <div
                  key={int.name}
                  className="bg-background border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                  <Icon className={`w-5 h-5 ${int.color}`} />
                  {int.name}
                </div>
              );
            })}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            EVA connects with your calendar, CRM, messaging apps, and email — so she fits seamlessly into your workflow.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
