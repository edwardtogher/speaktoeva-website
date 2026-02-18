import { useState, useEffect } from "react";

interface Heading {
  id: string;
  label: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <nav className="sticky top-24 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            On this page
          </p>
          {headings.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`block w-full text-left text-sm py-1 pl-3 border-l-2 transition-colors ${
                activeId === id
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile: collapsible block */}
      <details className="lg:hidden mb-8 rounded-lg border p-4">
        <summary className="text-sm font-semibold cursor-pointer text-muted-foreground">
          On this page
        </summary>
        <nav className="mt-3 space-y-1">
          {headings.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="block w-full text-left text-sm py-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>
      </details>
    </>
  );
}
