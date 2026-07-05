import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EvaLogo from '@/components/EvaLogo';
import { useEvaVoice } from '@/components/EvaVoiceProvider';
import { BOOKING_LINK } from '@/config/eva';

export default function HeroSection() {
  const { logoState, startCall, endCall, isCallActive, getAudioLevels } = useEvaVoice();

  const handleLogoClick = () => {
    if (logoState === 'connecting' || isCallActive) {
      endCall();
    } else {
      startCall();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((document.activeElement as any)?.tagName)) return;
      if (e.key === '1') (window as any).setEvaLogoState?.('dormant');
      if (e.key === '2') (window as any).setEvaLogoState?.('connecting');
      if (e.key === '3') (window as any).setEvaLogoState?.('speaking');
      if (e.key === '4') (window as any).setEvaLogoState?.('listening');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="hero" className="relative py-16 px-4 overflow-hidden">
      {/* Subtle radial glow behind logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-4xl mx-auto text-center space-y-8"
      >
        {/* Kicker + headline */}
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            Enhanced Voice Assistant
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Your phone answered.<br />Every time.
          </h1>
          <p className="text-sm text-muted-foreground">
            Built on infrastructure proven across 62M+ calls.
          </p>
        </div>

        {/* EVA Logo */}
        <div className="py-8 space-y-6">
          <EvaLogo state={logoState} onClick={handleLogoClick} className="mx-auto" getLevels={getAudioLevels} />
          <div className="flex justify-center">
            <Button size="lg" onClick={handleLogoClick} data-testid="button-talk-to-eva">
              {logoState === 'connecting' ? 'Connecting...' : isCallActive ? 'End Call' : 'Talk to EVA'}
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            EVA greets callers, understands intent, books appointments, and follows up — so you never lose revenue to a missed call again.
          </p>

          <div className="flex justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open(BOOKING_LINK, '_blank')}
              data-testid="button-book-walkthrough"
            >
              Book a 10-min walkthrough
            </Button>
          </div>

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
      </motion.div>
    </section>
  );
}
