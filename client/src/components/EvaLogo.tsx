export type LogoState = 'dormant' | 'connecting' | 'speaking' | 'listening';

interface EvaLogoProps {
  state?: LogoState;
  onClick?: () => void;
  className?: string;
}

// The Eva waveform mark (media/eva-mark.svg) decomposed into its 9 zigzag
// strokes, reconstructed from the original path's edge lines (99.8% pixel
// match to the union). Each stroke is a whole shape, so they can animate
// independently with no clipping seams or protruding edges mid-animation.
const STROKES: string[] = [
  '92.1,388.5 192.3,337.4 204.8,752.2 92.1,752.9',
  '261.8,241.2 335.4,241.2 225.1,752.0 153.4,752.0',
  '256.7,241.2 374.3,241.2 387.6,847.0 276.2,847.0',
  '435.7,155.2 559.0,155.2 387.6,847.0 330.3,847.0',
  '436.9,155.2 550.3,155.2 559.0,924.8 452.1,924.8',
  '609.6,239.1 690.9,239.1 566.6,924.8 474.6,924.8',
  '601.6,239.1 726.2,239.1 735.0,847.0 626.0,847.0',
  '775.5,333.5 846.5,333.5 742.6,847.0 652.1,847.0',
  '797.6,333.4 910.3,333.3 910.3,732.4 810.1,750.8',
];

// Literal class names so Tailwind's content scan keeps them in the build
const STATE_CLASSES: Record<LogoState, string> = {
  dormant: 'eva-dormant',
  connecting: 'eva-connecting',
  speaking: 'eva-speaking',
  listening: 'eva-listening',
};

export default function EvaLogo({ state = 'dormant', onClick, className = '' }: EvaLogoProps) {
  const stateClass = STATE_CLASSES[state] ?? STATE_CLASSES.dormant;
  const center = (STROKES.length - 1) / 2;

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
          {STROKES.map((points, i) => (
            <polygon
              key={i}
              points={points}
              className={`fill-primary ${stateClass}`}
              style={{
                transformOrigin: '540px 540px',
                transformBox: 'view-box',
                animationDelay: `${Math.abs(i - center) * 110}ms`,
              }}
            />
          ))}
        </svg>
      </button>
    </div>
  );
}
