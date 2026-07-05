import { Linkedin } from 'lucide-react';

const quickLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Integrations', href: '/#integrations' },
  { label: 'Login', href: 'https://dash.speaktoeva.com', external: true },
];

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Data Processing', href: '/dpa' },
];

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 px-4 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row flex-wrap gap-x-10 gap-y-4 justify-between">
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="microlabel text-foreground/50 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="microlabel text-foreground/50 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-foreground/10">
          <p className="microlabel text-foreground/40">
            &copy; {new Date().getFullYear()} SpeakToEva — All rights reserved
          </p>
          <a
            href="https://www.linkedin.com/in/edward-togher"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 microlabel text-foreground/40 hover:text-primary transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
            Edward Togher
          </a>
        </div>
      </div>
    </footer>
  );
}
