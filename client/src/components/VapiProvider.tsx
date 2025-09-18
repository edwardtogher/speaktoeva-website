import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Vapi from '@vapi-ai/web';
import { VAPI_CONFIG } from '@/config/vapi';
import { LogoState } from './EvaLogo';
import { useToast } from '@/hooks/use-toast';

interface VapiContextType {
  vapi: Vapi | null;
  isCallActive: boolean;
  logoState: LogoState;
  startCall: () => Promise<void>;
  endCall: () => void;
}

const VapiContext = createContext<VapiContextType | undefined>(undefined);

interface VapiProviderProps {
  children: ReactNode;
}

export function VapiProvider({ children }: VapiProviderProps) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [logoState, setLogoState] = useState<LogoState>('dormant');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Vapi
    const vapiInstance = new Vapi(VAPI_CONFIG.publicKey);
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsCallActive(true);
      setLogoState('listening');
      toast({
        title: "Call Connected",
        description: "You're now connected to EVA. Start speaking!",
      });
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsCallActive(false);
      // Always reset to dormant when call ends, regardless of previous state
      setLogoState('dormant');
      toast({
        title: "Call Ended",
        description: "Your conversation with EVA has ended.",
      });
    });

    vapiInstance.on('message', (message) => {
      console.log('Message received:', message);
      
      // ONLY use assistant speech-update events (ignore all user speech)
      if (message.type === 'speech-update' && message.role === 'assistant') {
        if (message.status === 'started') {
          console.log('🔊 Assistant started speaking');
          setLogoState('speaking');
        } else if (message.status === 'stopped') {
          console.log('👂 Assistant stopped speaking');
          setLogoState('listening');
        }
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsCallActive(false);
      // Always reset to dormant on error
      setLogoState('dormant');
      toast({
        title: "Connection Error",
        description: "Couldn't connect to EVA. Please try again.",
        variant: "destructive",
      });
    });

    // Expose global function for manual testing (from original design)
    if (typeof window !== 'undefined') {
      (window as any).setEvaLogoState = (state: LogoState) => {
        console.log(`Setting EVA logo state to: ${state}`);
        setLogoState(state);
      };
    }

    return () => {
      vapiInstance.stop();
    };
  }, [toast]);

  const startCall = async () => {
    if (!vapi) {
      toast({
        title: "Error",
        description: "Vapi not initialized. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLogoState('connecting');
      
      await vapi.start(VAPI_CONFIG.assistantId);
    } catch (error) {
      console.error('Failed to start call:', error);
      setLogoState('dormant');
      setIsCallActive(false);
      toast({
        title: "Call Failed",
        description: "Couldn't start the call. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    if (vapi) {
      // Stop the Vapi call - this cancels ongoing connections and ends active calls
      vapi.stop();
      
      // Immediately reset UI state
      setLogoState('dormant');
      setIsCallActive(false);
      
      console.log('Call manually ended/cancelled');
      
      // Show appropriate toast based on current state
      if (logoState === 'connecting') {
        toast({
          title: "Connection Cancelled",
          description: "Call connection was cancelled.",
        });
      }
    }
  };

  const value = {
    vapi,
    isCallActive,
    logoState,
    startCall,
    endCall,
  };

  return (
    <VapiContext.Provider value={value}>
      {children}
    </VapiContext.Provider>
  );
}

export function useVapi() {
  const context = useContext(VapiContext);
  if (!context) {
    throw new Error('useVapi must be used within a VapiProvider');
  }
  return context;
}