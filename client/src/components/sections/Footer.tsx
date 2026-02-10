import { Linkedin } from 'lucide-react';

const quickLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Login', href: 'https://dash.speaktoeva.com', external: true },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Footer() {
  return (
    <footer className="py-10 px-4 border-t">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Quick links */}
        <nav className="flex flex-wrap gap-6 justify-center">
          {quickLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SpeakToEva. All rights reserved.
          </p>
          <a
            href="https://www.linkedin.com/in/edward-togher"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            Edward Togher
          </a>
        </div>
      </div>
    </footer>
  );
}
