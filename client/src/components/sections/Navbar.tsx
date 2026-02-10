import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { BOOKING_LINK } from '@/config/vapi';
import evaWordmark from '@assets/linked in post Artboard 3_1758296319703.png';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Integrations', href: '#integrations' },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm transition-shadow ${
        scrolled ? 'border-b shadow-sm' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
        <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={evaWordmark} alt="EVA" className="h-14" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              {l.label}
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => scrollTo('#hero')}>
            Try Demo
          </Button>
          <Button size="sm" onClick={() => window.open(BOOKING_LINK, '_blank')}>
            Book a Call
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://dash.speaktoeva.com" target="_blank" rel="noopener noreferrer">
              Login
            </a>
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => { scrollTo(l.href); setOpen(false); }}
                  className="text-left text-lg font-medium text-foreground"
                >
                  {l.label}
                </button>
              ))}
              <Button variant="ghost" onClick={() => { scrollTo('#hero'); setOpen(false); }}>
                Try Demo
              </Button>
              <Button onClick={() => { window.open(BOOKING_LINK, '_blank'); setOpen(false); }}>
                Book a Call
              </Button>
              <Button variant="outline" asChild>
                <a href="https://dash.speaktoeva.com" target="_blank" rel="noopener noreferrer">
                  Login
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
