export type LogoState = 'dormant' | 'connecting' | 'speaking' | 'listening';

interface EvaLogoProps {
  state?: LogoState;
  onClick?: () => void;
  className?: string;
}

// The real Eva waveform mark (media/eva-mark.svg), sliced into 7 vertical
// segments at the low-ink valleys between bars so each segment can animate
// independently like an equaliser.
const MARK_PATH =
  'M550.27,155.19l4.11,364.33,55.21-280.41h116.6l4.11,282.46,45.19-188.09,134.81-.21v399.14l-100.23,18.43-6.12-206.74-61.39,302.93h-116.6c-3.75-32.94-1.24-66.21-1.96-99.36-.65-29.92,0-62.22-2.05-92.1-.22-3.12-.45-12.16-4.15-13.22l-51.16,282.46h-114.55l-6.16-313.16-58.28,235.38h-111.48l-9.22-288.6-41.81,193.54-133.08.91v-364.34l100.22-51.16,6.13,202.62,63.43-298.83h112.51l6.12,276.32,55.25-362.28h114.55Z';

const SLICE_BOUNDS = [92, 202, 262, 384, 575, 735, 799, 909];

export default function EvaLogo({ state = 'dormant', onClick, className = '' }: EvaLogoProps) {
  const stateClass = `eva-${state}`;
  const center = (SLICE_BOUNDS.length - 2) / 2;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={onClick}
        className="group focus:outline-none focus:ring-0 bg-transparent border-none p-0 cursor-pointer"
        aria-label="Talk to EVA"
        data-testid="button-eva-logo"
      >
        <svg
          viewBox="0 0 1080 1080"
          className="w-full max-w-xs h-auto transition-transform group-hover:scale-105"
          role="img"
          aria-label="EVA waveform logo"
        >
          <defs>
            {SLICE_BOUNDS.slice(0, -1).map((x0, i) => (
              <clipPath key={i} id={`eva-slice-${i}`}>
                <rect x={x0} y={0} width={SLICE_BOUNDS[i + 1] - x0} height={1080} />
              </clipPath>
            ))}
          </defs>
          {SLICE_BOUNDS.slice(0, -1).map((_, i) => (
            <g
              key={i}
              clipPath={`url(#eva-slice-${i})`}
              className={stateClass}
              style={{
                transformOrigin: '540px 540px',
                transformBox: 'view-box',
                animationDelay: `${Math.abs(i - center) * 140}ms`,
              }}
            >
              <path d={MARK_PATH} className="fill-primary" />
            </g>
          ))}
        </svg>
      </button>
    </div>
  );
}
