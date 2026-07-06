import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import SocialProof from '@/components/sections/SocialProof';
import HowItWorks from '@/components/sections/HowItWorks';
import Features from '@/components/sections/Features';
import Integrations from '@/components/sections/Integrations';
import Industries from '@/components/sections/Industries';
import CtaSection from '@/components/sections/CtaSection';
import DemoStrip from '@/components/sections/DemoStrip';
import Footer from '@/components/sections/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-[60]"
      >
        Skip to content
      </a>

      <Navbar />
      <HeroSection />
      <SocialProof />
      <HowItWorks />
      <DemoStrip label="Want this answering your phones?" />
      <Features />
      <Integrations />
      <DemoStrip label="Hear Eva trained on your business." />
      <Industries />
      <CtaSection />
      <Footer />
    </main>
  );
}
