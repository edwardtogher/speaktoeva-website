import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EvaLogo from './EvaLogo';
import { useVapi } from './VapiProvider';
import { BOOKING_LINK } from '@/config/vapi';

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

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="flex items-center justify-between p-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/25"></div>
          <span className="font-bold text-lg">EVA</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
            Pricing
          </a>
          <Button variant="ghost" onClick={handleLogoClick} data-testid="button-nav-demo">
            {(isCallActive || logoState === 'connecting') ? 'End Call' : 'Try Live Demo'}
          </Button>
          <Button onClick={handleBookCall} data-testid="button-nav-book">
            Book a Call
          </Button>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Kicker and Headline */}
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">
              Enhanced Voice Assistant
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Your phone answered. Every time.
            </h1>
          </div>

          {/* EVA Logo */}
          <div className="py-8">
            <EvaLogo 
              state={logoState} 
              onClick={handleLogoClick}
              className="mx-auto"
            />
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              EVA greets callers, understands intent, books appointments, and follows up—so you never lose revenue to a missed call again.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={handleLogoClick} data-testid="button-talk-to-eva">
                {(isCallActive || logoState === 'connecting') ? 'End Call' : 'Talk to EVA'}
              </Button>
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
    </main>
  );
}