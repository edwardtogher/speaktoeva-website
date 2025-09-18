import { useState, useRef, useEffect } from 'react';

export type LogoState = 'dormant' | 'connecting' | 'speaking' | 'listening';

interface EvaLogoProps {
  state?: LogoState;
  onClick?: () => void;
  className?: string;
}

export default function EvaLogo({ state = 'dormant', onClick, className = '' }: EvaLogoProps) {
  const logoRef = useRef<SVGSVGElement>(null);

  // Heights for the five bars (middle tallest, outers shortest)
  const heights = [120, 180, 240, 180, 120];
  const barWidth = 28;
  const gap = 30;
  const midY = 160;

  // Calculate positions
  const totalWidth = heights.length * barWidth + (heights.length - 1) * gap;
  const startX = -totalWidth / 2;

  useEffect(() => {
    // Expose global function for manual testing
    if (typeof window !== 'undefined') {
      (window as any).setEvaLogoState = (newState: LogoState) => {
        console.log(`Setting EVA logo state to: ${newState}`);
      };
    }
  }, []);

  const getAnimationClass = (state: LogoState, index: number) => {
    const center = Math.floor(heights.length / 2);
    const delay = Math.abs(index - center) * 140; // 140ms stagger as in original
    
    switch (state) {
      case 'connecting':
        return `eva-connecting`;
      case 'speaking':
        return `eva-speaking`;
      case 'listening':
        return `eva-listening`;
      default:
        return '';
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <button
        onClick={onClick}
        className="group focus:outline-none focus:ring-0 bg-transparent border-none p-0 cursor-pointer"
        aria-label="Talk to EVA"
        data-testid="button-eva-logo"
      >
        <svg
          ref={logoRef}
          viewBox="0 0 700 320"
          className="w-full max-w-md h-auto transition-transform group-hover:scale-105"
          role="img"
          aria-label="EVA five-bar animated logo"
        >
          <g transform="translate(350, 0)">
            {heights.map((height, index) => {
              const x = startX + index * (barWidth + gap);
              const y = midY - height / 2;
              const delay = Math.abs(index - Math.floor(heights.length / 2)) * 140;
              
              return (
                <rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx={8}
                  className={`fill-primary ${getAnimationClass(state, index)}`}
                  style={{
                    transformOrigin: '50% 50%',
                    transformBox: 'fill-box',
                    animationDelay: `${Math.abs(index - Math.floor(heights.length / 2)) * 140}ms`,
                  }}
                />
              );
            })}
          </g>
        </svg>
      </button>
      
      <div className="text-sm text-muted-foreground" aria-live="polite" data-testid="text-logo-status">
        <span className="font-medium">
          {state === 'dormant' && 'Click to speak'}
          {state === 'connecting' && 'Connecting...'}
          {state === 'listening' && 'Click to stop'}
          {state === 'speaking' && 'Click to stop'}
        </span>
      </div>
    </div>
  );
}