import { useState } from 'react';
import EvaLogo, { LogoState } from '../EvaLogo';

export default function EvaLogoExample() {
  const [currentState, setCurrentState] = useState<LogoState>('dormant');

  const states: LogoState[] = ['dormant', 'connecting', 'speaking', 'listening'];

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <EvaLogo 
        state={currentState} 
        onClick={() => console.log('Logo clicked')}
      />
      
      <div className="flex gap-2 flex-wrap justify-center">
        {states.map((state) => (
          <button
            key={state}
            onClick={() => setCurrentState(state)}
            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              currentState === state
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-accent'
            }`}
            data-testid={`button-state-${state}`}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}