import { useEffect, useRef } from 'react';

export type LogoState = 'dormant' | 'connecting' | 'speaking' | 'listening';

interface EvaLogoProps {
  state?: LogoState;
  onClick?: () => void;
  className?: string;
}

// The Eva waveform mark (media/eva-mark.svg) decomposed into its 9 zigzag
// strokes. Strokes share junction nodes (t = top node, b = bottom node), so
// animating node offsets keeps every joint pinned — the mark deforms like a
// live waveform but can never come apart.
const Q = [
  { p: [92.1, 388.5, 192.3, 337.4, 204.8, 752.2, 92.1, 752.9], t: 0, b: 1 },
  { p: [261.8, 241.2, 335.4, 241.2, 225.1, 752.0, 153.4, 752.0], t: 2, b: 1 },
  { p: [261.8, 241.2, 374.3, 241.2, 387.6, 847.0, 276.2, 847.0], t: 2, b: 3 },
  { p: [435.7, 155.2, 550.3, 155.2, 387.6, 847.0, 330.3, 847.0], t: 4, b: 3 },
  { p: [436.9, 155.2, 550.3, 155.2, 559.0, 924.8, 452.1, 924.8], t: 4, b: 5 },
  { p: [609.6, 239.1, 690.9, 239.1, 566.6, 924.8, 474.6, 924.8], t: 6, b: 5 },
  { p: [609.6, 239.1, 726.2, 239.1, 735.0, 847.0, 626.0, 847.0], t: 6, b: 7 },
  { p: [775.5, 333.5, 846.5, 333.5, 742.6, 847.0, 652.1, 847.0], t: 8, b: 7 },
  { p: [797.6, 333.4, 910.3, 333.3, 910.3, 732.4, 810.1, 750.8], t: 8, b: 9 },
];
const NODEY = [363, 752.5, 241.2, 847, 155.2, 924.8, 239.1, 847, 333.4, 741.6];
const MID = 540;
const C = 4.5;

type Pose = { dy: number[]; sx: number; sy: number; ty: number };
const zero = (): Pose => ({ dy: new Array(10).fill(0), sx: 1, sy: 1, ty: 0 });

// Volume-knob ripple: node displacement proportional to its distance from the
// midline, so the mark shrinks toward silence and swells back to EXACTLY logo
// size — never past its own silhouette.
function rippleF(t: number, d: number, w: number) {
  return -0.45 * (0.88 + 0.12 * Math.sin(t * 1.4)) * (0.5 + 0.5 * Math.sin(t * w - d * 0.9));
}

type Mode = 'idle' | 'hover' | 'connecting' | 'listening' | 'speaking';

const MODES: Record<Mode, (t: number) => Pose> = {
  // Resting heartbeat — da-dum… da-dum
  idle: (t) => {
    const o = zero();
    const tt = t % 1.6;
    const th = (x: number) => Math.exp(-Math.pow((tt - x) / 0.085, 2));
    const e = th(0.18) + 0.6 * th(0.47);
    for (let n = 0; n < 10; n++) {
      o.dy[n] = 30 * e * Math.cos((n - C) * 0.5) + 2.5 * Math.sin(t * 0.9 - n * 0.5);
    }
    o.sy = 1 + 0.015 * e;
    return o;
  },
  // Excited shake: fast shiver + small bounce, within the logo silhouette
  hover: (t) => {
    const o = zero();
    for (let n = 0; n < 10; n++) {
      const f = -0.065 + 0.065 * Math.sin(t * 16 - n * 1.3);
      o.dy[n] = (NODEY[n] - MID) * f;
    }
    o.ty = -5 + 2.5 * Math.sin(t * 8);
    o.sy = 1.008 + 0.008 * Math.sin(t * 16);
    return o;
  },
  // Mexican wave capped at the logo: strokes pop up to full height in turn
  connecting: (t) => {
    const o = zero();
    const pos = ((t * 7) % 17) - 3.5;
    for (let n = 0; n < 10; n++) {
      const bump = Math.exp(-Math.pow(n - pos, 2) / 1.6);
      o.dy[n] = (NODEY[n] - MID) * (-0.33 * (1 - bump));
    }
    return o;
  },
  // Speaking's ripple, hushed into a flat 30%-height whisper
  listening: (t) => {
    const o = zero();
    for (let n = 0; n < 10; n++) {
      const d = Math.abs(n - C);
      o.dy[n] = (NODEY[n] - MID) * rippleF(t, d, 5.6);
    }
    o.sy = 0.3;
    o.sx = 1.08;
    return o;
  },
  // Continuous volume ripple, a touch quicker than listening
  speaking: (t) => {
    const o = zero();
    for (let n = 0; n < 10; n++) {
      const d = Math.abs(n - C);
      o.dy[n] = (NODEY[n] - MID) * rippleF(t, d, 6.6);
    }
    return o;
  },
};

export default function EvaLogo({ state = 'dormant', onClick, className = '' }: EvaLogoProps) {
  const gRef = useRef<SVGGElement>(null);
  const polyRefs = useRef<(SVGPolygonElement | null)[]>([]);
  const hoveredRef = useRef(false);
  const stateRef = useRef<LogoState>(state);
  const modeRef = useRef<Mode>('idle');
  const prevModeRef = useRef<Mode>('idle');
  const blendRef = useRef(1);

  stateRef.current = state;

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resolveMode = (): Mode =>
      stateRef.current === 'dormant' ? (hoveredRef.current ? 'hover' : 'idle') : stateRef.current;

    let raf = 0;
    let t0: number | null = null;

    const frame = (ts: number) => {
      if (t0 === null) t0 = ts;
      const t = (ts - t0) / 1000;

      const target = resolveMode();
      if (target !== modeRef.current) {
        prevModeRef.current = modeRef.current;
        modeRef.current = target;
        blendRef.current = 0;
      }
      if (blendRef.current < 1) blendRef.current = Math.min(1, blendRef.current + 0.04);
      const m = blendRef.current;

      const a = MODES[prevModeRef.current](t);
      const b = MODES[modeRef.current](t);
      const dy: number[] = [];
      for (let n = 0; n < 10; n++) dy[n] = a.dy[n] * (1 - m) + b.dy[n] * m;
      const sx = a.sx * (1 - m) + b.sx * m;
      const sy = a.sy * (1 - m) + b.sy * m;
      const ty = a.ty * (1 - m) + b.ty * m;

      gRef.current?.setAttribute(
        'transform',
        `translate(505 545) scale(${sx} ${sy}) translate(-505 ${-545 + ty})`
      );
      Q.forEach((q, i) => {
        const p = q.p;
        const yt = dy[q.t];
        const yb = dy[q.b];
        polyRefs.current[i]?.setAttribute(
          'points',
          `${p[0]},${p[1] + yt} ${p[2]},${p[3] + yt} ${p[4]},${p[5] + yb} ${p[6]},${p[7] + yb}`
        );
      });

      raf = requestAnimationFrame(frame);
    };

    if (!reduceMotion) raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={onClick}
        onMouseEnter={() => (hoveredRef.current = true)}
        onMouseLeave={() => (hoveredRef.current = false)}
        className="group focus:outline-none focus:ring-0 bg-transparent border-none p-0 cursor-pointer"
        aria-label="Talk to EVA"
        data-testid="button-eva-logo"
      >
        <svg
          viewBox="-80 -60 1240 1240"
          className="w-full max-w-xs h-auto"
          role="img"
          aria-label="EVA waveform logo"
        >
          <g ref={gRef}>
            {Q.map((q, i) => (
              <polygon
                key={i}
                ref={(el) => (polyRefs.current[i] = el)}
                points={`${q.p[0]},${q.p[1]} ${q.p[2]},${q.p[3]} ${q.p[4]},${q.p[5]} ${q.p[6]},${q.p[7]}`}
                className="fill-primary"
              />
            ))}
          </g>
        </svg>
      </button>
    </div>
  );
}
