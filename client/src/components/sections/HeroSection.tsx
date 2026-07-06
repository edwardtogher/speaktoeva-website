import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import EvaLogo from '@/components/EvaLogo';
import { useEvaVoice } from '@/components/EvaVoiceProvider';

const SPEC = [
  ['Unit', 'EVA-001'],
  ['Role', 'AI receptionist'],
  ['Coverage', '24/7/365'],
  ['Response', '<1 second'],
  ['Infra', '62M+ calls'],
];

const STATE_LABEL: Record<string, string> = {
  dormant: 'Ready',
  connecting: 'Connecting',
  listening: 'Listening',
  speaking: 'Speaking',
};

const METER_CELLS = 14;

// Live telemetry strip under the mark — real values from the call engine,
// updated every frame while a call is running.
function LiveReadout() {
  const { logoState, isCallActive, getAudioLevels } = useEvaVoice();
  const meterRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (isCallActive && startRef.current === null) startRef.current = Date.now();
    if (!isCallActive) startRef.current = null;
  }, [isCallActive]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const levels = getAudioLevels();
      const vol = levels ? Math.max(levels.out, levels.in) : 0;
      const lit = Math.round(Math.min(1, vol * 1.6) * METER_CELLS);
      const cells = meterRef.current?.children;
      if (cells) {
        for (let i = 0; i < cells.length; i++) {
          (cells[i] as HTMLElement).style.opacity = i < lit ? '1' : '0.15';
        }
      }
      if (clockRef.current) {
        if (startRef.current) {
          const s = Math.floor((Date.now() - startRef.current) / 1000);
          clockRef.current.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
        } else {
          clockRef.current.textContent = '--:--';
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [getAudioLevels]);

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-foreground/10 px-4 sm:px-6 py-3">
      <span className="microlabel text-foreground/60">
        State <span className="text-primary font-bold">{STATE_LABEL[logoState]}</span>
      </span>
      <span className="microlabel text-foreground/60 flex items-center gap-2">
        Signal
        <span ref={meterRef} className="flex gap-[3px]" aria-hidden="true">
          {Array.from({ length: METER_CELLS }).map((_, i) => (
            <span key={i} className="w-[3px] h-3 bg-primary" style={{ opacity: 0.15 }} />
          ))}
        </span>
      </span>
      <span className="microlabel text-foreground/60">
        Session <span ref={clockRef} className="text-primary font-bold">--:--</span>
      </span>
      <span className="microlabel text-foreground/40 ml-auto hidden sm:inline">
        {isCallActive ? 'Click the waveform to end' : 'Click the waveform to speak'}
      </span>
    </div>
  );
}

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
    <section id="hero" className="px-4 lg:px-8 pt-12 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Headline row: massive display type left, spec ledger right */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end mb-12"
        >
          <div>
            <p className="microlabel text-primary mb-6">Enhanced voice assistant</p>
            <h1 className="font-display font-extrabold uppercase leading-[0.95] text-[clamp(2.6rem,7.5vw,5.8rem)] tracking-tight">
              Your phone
              <br />
              answered.
              <br />
              <span className="text-primary">Every time.</span>
            </h1>
          </div>

          <dl className="hidden lg:block w-64 border-t border-foreground/10">
            {SPEC.map(([k, v]) => (
              <div key={k} className="flex justify-between items-baseline border-b border-foreground/10 py-2.5">
                <dt className="microlabel text-foreground/50">{k}</dt>
                <dd className="font-mono text-sm font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Specimen chamber: Eva live on a blueprint stage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="relative border border-foreground/15 blueprint"
        >
          <span className="tick tick-tl" aria-hidden="true" />
          <span className="tick tick-tr" aria-hidden="true" />
          <span className="tick tick-bl" aria-hidden="true" />
          <span className="tick tick-br" aria-hidden="true" />

          <div className="flex justify-between px-4 sm:px-6 pt-3">
            <span className="microlabel text-foreground/40">Live specimen</span>
            <span className="microlabel text-foreground/40">Fig. 01 — waveform</span>
          </div>

          <div className="flex justify-center py-6 sm:py-10">
            <EvaLogo state={logoState} onClick={handleLogoClick} getLevels={getAudioLevels} />
          </div>

          <LiveReadout />
        </motion.div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button size="lg" className="btn-sharp h-12 px-8" onClick={handleLogoClick} data-testid="button-talk-to-eva">
            {logoState === 'connecting' ? 'Connecting…' : isCallActive ? 'End call' : 'Talk to Eva'}
          </Button>
          <p className="microlabel text-foreground/40 sm:ml-auto self-center">
            She greets, books, and follows up — while you work.
          </p>
        </div>
      </div>
    </section>
  );
}
