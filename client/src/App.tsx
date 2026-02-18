import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VapiProvider } from "@/components/VapiProvider";
import LandingPage from "@/components/LandingPage";
import BlowerPage from "@/pages/blower";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import DpaPage from "@/pages/dpa";
import NotFound from "@/pages/not-found";
import ScrollToTop from "@/components/legal/ScrollToTop";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/call" component={BlowerPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/dpa" component={DpaPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <VapiProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Router />
          </div>
          <Toaster />
        </VapiProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
