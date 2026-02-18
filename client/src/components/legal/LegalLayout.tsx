import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import TableOfContents from "./TableOfContents";
import BackToTop from "./BackToTop";

interface Heading {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  headings: Heading[];
  children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, headings, children }: LegalLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
          <TableOfContents headings={headings} />
          <article className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20">
            {children}
          </article>
        </div>
      </div>
      <BackToTop />
      <Footer />
    </>
  );
}
