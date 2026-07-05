import { Button } from '@/components/ui/button';
import { useEvaVoice } from '@/components/EvaVoiceProvider';
import { BOOKING_LINK } from '@/config/eva';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

// Full-bleed indigo inversion — the one loud moment on the page
export default function CtaSection() {
  const { startCall, endCall, isCallActive, logoState } = useEvaVoice();

  const handleTalk = () => {
    if (logoState === 'connecting' || isCallActive) {
      endCall();
    } else {
      startCall();
    }
  };

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-24 lg:py-32">
        <AnimateOnScroll>
          <span className="microlabel text-primary-foreground/60">Final transmission</span>
          <h2 className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-6 max-w-4xl">
            Stop losing customers to missed calls.
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mt-6">
            See how Eva handles your calls, books appointments, and keeps your business running — even when you can't pick up.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Button
              size="lg"
              className="btn-sharp h-12 px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => window.open(BOOKING_LINK, '_blank')}
            >
              Book your walkthrough
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-sharp h-12 px-8 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleTalk}
            >
              {logoState === 'connecting' ? 'Connecting…' : isCallActive ? 'End call' : 'Talk to Eva now'}
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
