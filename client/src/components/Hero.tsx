import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EvaLogo from './EvaLogo';
import { useVapi } from './VapiProvider';
import { BOOKING_LINK } from '@/config/vapi';
import { 
  SiGooglecalendar, 
  SiSlack, 
  SiHubspot, 
  SiCalendly, 
  SiZapier, 
  SiWhatsapp, 
  SiGmail
} from 'react-icons/si';
import { MessageSquare, Mail } from 'lucide-react';

export default function Hero() {
  const { logoState, startCall, endCall, isCallActive } = useVapi();

  const handleLogoClick = () => {
    if (logoState === 'connecting' || isCallActive) {
      // Cancel/end call if connecting or already active
      endCall();
    } else {
      // Start call if dormant
      startCall();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (['INPUT', 'TEXTAREA'].includes((document.activeElement as any)?.tagName)) {
        return;
      }

      // Manual state control for testing (from original design)
      if (e.key === '1' && typeof window !== 'undefined') {
        (window as any).setEvaLogoState?.('dormant');
      }
      if (e.key === '2' && typeof window !== 'undefined') {
        (window as any).setEvaLogoState?.('connecting');
      }
      if (e.key === '3' && typeof window !== 'undefined') {
        (window as any).setEvaLogoState?.('speaking');
      }
      if (e.key === '4' && typeof window !== 'undefined') {
        (window as any).setEvaLogoState?.('listening');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBookCall = () => {
    window.open(BOOKING_LINK, '_blank');
  };

  const handleScrollToHero = () => {
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to calling EVA if no hero element
      handleLogoClick();
    }
  };

  const handleScrollToGetStarted = () => {
    const getStartedElement = document.getElementById('get-started');
    if (getStartedElement) {
      getStartedElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to opening booking link
      handleBookCall();
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Skip to content link for accessibility */}
      <a 
        href="#hero" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to content
      </a>

      {/* Navigation */}
      <header className="flex items-center justify-between p-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/25"></div>
          <span className="font-bold text-lg">EVA</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#authority" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
            Features
          </a>
          <a href="#trust" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
            Pricing
          </a>
          <Button variant="ghost" onClick={handleScrollToHero} data-testid="button-nav-demo">
            Try Demo
          </Button>
          <Button onClick={handleScrollToGetStarted} data-testid="button-nav-book">
            Book a Call
          </Button>
        </nav>
      </header>

      {/* Hero Content */}
      <div id="hero" className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Kicker and Headline */}
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">
              Enhanced Voice Assistant
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Your phone answered. Every time.
            </h1>
            <p className="text-sm text-muted-foreground">
              Built on infrastructure proven across 62M+ calls.
            </p>
          </div>

          {/* EVA Logo */}
          <div className="py-8 space-y-6">
            <EvaLogo 
              state={logoState} 
              onClick={handleLogoClick}
              className="mx-auto"
            />
            
            {/* Talk to EVA Button */}
            <div className="flex justify-center">
              <Button size="lg" onClick={handleLogoClick} data-testid="button-talk-to-eva">
                {logoState === 'connecting' ? 'Connecting...' : (isCallActive ? 'End Call' : 'Talk to EVA')}
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              EVA greets callers, understands intent, books appointments, and follows up—so you never lose revenue to a missed call again.
            </p>

            {/* CTAs */}
            <div className="flex justify-center">
              <Button size="lg" variant="outline" onClick={handleBookCall} data-testid="button-book-walkthrough">
                Book a 10-min walkthrough
              </Button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                24/7 coverage
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Instant handovers
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                CRM updates
              </Badge>
            </div>
          </div>

        </div>
      </div>

      {/* Authority Statement Section */}
      <section id="authority" className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            The future of business calls is here.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Voice AI is changing how companies handle phone calls worldwide — now EVA brings that same technology to small businesses.
          </p>
        </div>
      </section>

      {/* Integrations Strip */}
      <section id="integrations" className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">
            Works with the tools you already use.
          </h2>
          
          {/* Integration logos/pills */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {[
              { name: 'Google Calendar', icon: SiGooglecalendar },
              { name: 'Slack', icon: SiSlack },
              { name: 'HubSpot', icon: SiHubspot },
              { name: 'Calendly', icon: SiCalendly },
              { name: 'Zapier', icon: SiZapier },
              { name: 'WhatsApp', icon: SiWhatsapp },
              { name: 'SMS', icon: MessageSquare },
              { name: 'Gmail', icon: SiGmail },
              { name: 'Outlook', icon: Mail }
            ].map((integration) => {
              const IconComponent = integration.icon;
              return (
                <div 
                  key={integration.name}
                  className="bg-background border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground flex items-center gap-2"
                  role="listitem"
                >
                  <IconComponent 
                    className="w-4 h-4" 
                    aria-hidden="true"
                  />
                  <span className="sr-only">{integration.name} integration</span>
                  {integration.name}
                </div>
              );
            })}
          </div>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            EVA connects with your calendar, CRM, messaging apps, and email — so she fits seamlessly into your workflow.
          </p>
        </div>
      </section>

      {/* Trust Badges Row */}
      <section id="trust" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <li className="bg-background border rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-semibold text-foreground">24/7 Availability</h3>
            </li>
            <li className="bg-background border rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-semibold text-foreground">Enterprise-grade Infrastructure</h3>
            </li>
            <li className="bg-background border rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-semibold text-foreground">Built on infrastructure proven across 62M+ calls</h3>
            </li>
            <li className="bg-background border rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-semibold text-foreground">Fits into your existing workflow</h3>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Repeat Section */}
      <section id="get-started" className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Ready to see EVA in action?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleLogoClick} data-testid="button-cta-talk-to-eva">
              Talk to EVA
            </Button>
            <Button size="lg" variant="outline" onClick={handleBookCall} data-testid="button-cta-book-demo">
              Book a 10-min demo
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}