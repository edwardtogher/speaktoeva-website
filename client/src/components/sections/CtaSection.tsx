import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const DEMO_ENDPOINT = 'https://intelligent-enthusiasm-production-6235.up.railway.app/leads/demo-request';

// Full-bleed indigo inversion — lead capture: their website in, their Eva back
export default function CtaSection() {
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch(DEMO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website, email, company: honeypot }),
      });
      const data = await res.json();
      setStatus(data.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="demo" className="bg-primary text-primary-foreground scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-24 lg:py-32">
        <AnimateOnScroll>
          <span className="microlabel text-primary-foreground/60">Free demo — no call required</span>
          <h2 className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-6 max-w-4xl">
            Give us your website.
            <br />
            Get Eva back.
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mt-6">
            Drop your URL and we'll build a working Eva trained on your business — then email you a
            live link so you can hear her answer your calls. Free, within 24 hours.
          </p>

          {status === 'done' ? (
            <div className="mt-10 border border-primary-foreground/30 px-6 py-5 max-w-xl">
              <p className="font-mono text-sm font-bold uppercase tracking-[0.12em]">
                Received. Eva is studying your website.
              </p>
              <p className="text-primary-foreground/70 text-sm mt-2">
                Your personal demo link will land in your inbox within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="yourwebsite.co.uk"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="flex-1 h-12 px-4 bg-transparent border border-primary-foreground/40 font-mono text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary-foreground"
                  data-testid="input-demo-website"
                />
                <input
                  type="email"
                  required
                  placeholder="you@yourwebsite.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 px-4 bg-transparent border border-primary-foreground/40 font-mono text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary-foreground"
                  data-testid="input-demo-email"
                />
                {/* Honeypot — humans never see or fill this */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === 'sending'}
                  className="btn-sharp h-12 px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  data-testid="button-build-demo"
                >
                  {status === 'sending' ? 'Sending…' : 'Build my demo'}
                </Button>
              </div>
              {status === 'error' && (
                <p className="font-mono text-xs mt-3 text-primary-foreground/80">
                  That didn't send — check the details and try again, or email hello@speaktoeva.com.
                </p>
              )}
            </form>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
}
