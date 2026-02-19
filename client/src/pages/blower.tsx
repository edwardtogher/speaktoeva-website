import { useState, useEffect } from "react";
import BlowerLogin from "@/components/blower/BlowerLogin";
import WhatsAppApp from "@/components/blower/WhatsAppApp";

interface BlowerSession {
  username: string;
  loggedInAt: number;
}

const SESSION_KEY = "blower_session";

export default function BlowerPage() {
  const [session, setSession] = useState<BlowerSession | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // corrupted session — clear it
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const handleLogin = (username: string) => {
    const s: BlowerSession = { username, loggedInAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  if (!session) {
    return <BlowerLogin onLogin={handleLogin} />;
  }

  return <WhatsAppApp username={session.username} onLogout={handleLogout} />;
}
