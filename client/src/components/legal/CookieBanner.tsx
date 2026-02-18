import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setShow(true);
    }
  }, []);

  const respond = (choice: "accepted" | "rejected") => {
    localStorage.setItem(COOKIE_KEY, choice);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left flex-1">
          We use cookies for analytics to improve our website.{" "}
          <a href="/privacy#cookies" className="underline hover:text-foreground">
            Learn more
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => respond("rejected")}>
            Reject
          </Button>
          <Button size="sm" onClick={() => respond("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
