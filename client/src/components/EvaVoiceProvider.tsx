import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Conversation } from '@elevenlabs/client';
import { EVA_CONFIG } from '@/config/eva';
import { LogoState } from './EvaLogo';
import { useToast } from '@/hooks/use-toast';

type EvaConversation = Awaited<ReturnType<typeof Conversation.startSession>>;

interface EvaVoiceContextType {
  isCallActive: boolean;
  logoState: LogoState;
  startCall: () => Promise<void>;
  endCall: () => void;
}

const EvaVoiceContext = createContext<EvaVoiceContextType | undefined>(undefined);

interface EvaVoiceProviderProps {
  children: ReactNode;
}

export function EvaVoiceProvider({ children }: EvaVoiceProviderProps) {
  const conversationRef = useRef<EvaConversation | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [logoState, setLogoState] = useState<LogoState>('dormant');
  const { toast } = useToast();

  useEffect(() => {
    // Expose global function for manual testing (from original design)
    if (typeof window !== 'undefined') {
      (window as any).setEvaLogoState = (state: LogoState) => {
        console.log(`Setting EVA logo state to: ${state}`);
        setLogoState(state);
      };
    }

    return () => {
      conversationRef.current?.endSession();
      conversationRef.current = null;
    };
  }, []);

  const startCall = async () => {
    if (conversationRef.current) return;

    try {
      setLogoState('connecting');

      // Prompt for mic access up front so a denial fails fast
      await navigator.mediaDevices.getUserMedia({ audio: true });

      conversationRef.current = await Conversation.startSession({
        agentId: EVA_CONFIG.agentId,
        connectionType: 'webrtc',
        onConnect: () => {
          setIsCallActive(true);
          setLogoState('listening');
          toast({
            title: "Call Connected",
            description: "You're now connected to EVA. Start speaking!",
          });
        },
        onDisconnect: () => {
          conversationRef.current = null;
          setIsCallActive(false);
          setLogoState('dormant');
          toast({
            title: "Call Ended",
            description: "Your conversation with EVA has ended.",
          });
        },
        onModeChange: ({ mode }) => {
          setLogoState(mode === 'speaking' ? 'speaking' : 'listening');
        },
        onError: (message) => {
          console.error('ElevenLabs error:', message);
          conversationRef.current?.endSession();
          conversationRef.current = null;
          setIsCallActive(false);
          setLogoState('dormant');
          toast({
            title: "Connection Error",
            description: "Couldn't connect to EVA. Please try again.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      conversationRef.current = null;
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
    const wasConnecting = logoState === 'connecting';

    conversationRef.current?.endSession();
    conversationRef.current = null;
    setLogoState('dormant');
    setIsCallActive(false);

    if (wasConnecting) {
      toast({
        title: "Connection Cancelled",
        description: "Call connection was cancelled.",
      });
    }
  };

  const value = {
    isCallActive,
    logoState,
    startCall,
    endCall,
  };

  return (
    <EvaVoiceContext.Provider value={value}>
      {children}
    </EvaVoiceContext.Provider>
  );
}

export function useEvaVoice() {
  const context = useContext(EvaVoiceContext);
  if (!context) {
    throw new Error('useEvaVoice must be used within an EvaVoiceProvider');
  }
  return context;
}
