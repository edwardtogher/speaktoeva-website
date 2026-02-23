import { useState } from 'react';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import SocialProof from '@/components/sections/SocialProof';
import HowItWorks from '@/components/sections/HowItWorks';
import Features from '@/components/sections/Features';
import Integrations from '@/components/sections/Integrations';
import Industries from '@/components/sections/Industries';
import CtaSection from '@/components/sections/CtaSection';
import Footer from '@/components/sections/Footer';
import ContactModal from '@/components/ContactModal';

export default function LandingPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const onContactOpen = () => setContactOpen(true);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-[60]"
      >
        Skip to content
      </a>

      <Navbar onContactOpen={onContactOpen} />
      <HeroSection onContactOpen={onContactOpen} />
      <SocialProof />
      <HowItWorks />
      <Features />
      <Integrations />
      <Industries />
      <CtaSection onContactOpen={onContactOpen} />
      <Footer />

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}
