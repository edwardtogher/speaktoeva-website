import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import evaWordmark from '@assets/linked in post Artboard 3_1758296319703.png';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Integrations', href: '/#integrations' },
];

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
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b transition-colors ${
        scrolled ? 'border-foreground/15' : 'border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
        <a href="/">
          <img src={evaWordmark} alt="EVA" className="h-14" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="microlabel text-foreground/60 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Button variant="ghost" size="sm" className="btn-sharp" asChild>
            <a href="/#hero">Talk to Eva</a>
          </Button>
          <Button size="sm" className="btn-sharp" asChild>
            <a href="/#demo">Free Demo</a>
          </Button>
          <Button variant="outline" size="sm" className="btn-sharp border-foreground/20" asChild>
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
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-left text-lg font-medium text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <Button variant="ghost" asChild>
                <a href="/#hero" onClick={() => setOpen(false)}>Talk to Eva</a>
              </Button>
              <Button asChild>
                <a href="/#demo" onClick={() => setOpen(false)}>Free Demo</a>
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
