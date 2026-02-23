import { Button } from '@/components/ui/button';
import { useVapi } from '@/components/VapiProvider';
import { BOOKING_LINK } from '@/config/vapi';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

export default function CtaSection() {
  const { startCall, endCall, isCallActive, logoState } = useVapi();

  const handleTalk = () => {
    if (logoState === 'connecting' || isCallActive) {
      endCall();
    } else {
      startCall();
    }
  };

  return (
    <section className="py-20 px-4">
      <AnimateOnScroll>
        <div className="max-w-3xl mx-auto border rounded-lg bg-muted/30 p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Stop losing customers to missed calls.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See how EVA handles your calls, books appointments, and keeps your business running — even when you can't pick up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              size="lg"
              onClick={() => window.open(BOOKING_LINK, '_blank')}
            >
              Book your walkthrough
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleTalk}
            >
              {logoState === 'connecting' ? 'Connecting...' : isCallActive ? 'End Call' : 'Talk to EVA now'}
            </Button>
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
