import { VapiProvider } from '../VapiProvider';
import { Button } from '@/components/ui/button';
import { useVapi } from '../VapiProvider';

function VapiTestComponent() {
  const { isCallActive, logoState, startCall, endCall } = useVapi();

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Vapi Integration Test</h3>
        <p className="text-sm text-muted-foreground">
          Status: {isCallActive ? 'Active' : 'Inactive'} | State: {logoState}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={startCall} disabled={isCallActive}>
          Start Call
        </Button>
        <Button onClick={endCall} disabled={!isCallActive} variant="outline">
          End Call
        </Button>
      </div>
    </div>
  );
}

export default function VapiProviderExample() {
  return (
    <VapiProvider>
      <VapiTestComponent />
    </VapiProvider>
  );
}