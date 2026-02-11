import { useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { BLOWER_USERS } from "@/config/blower-users";

interface BlowerLoginProps {
  onLogin: (username: string) => void;
}

export default function BlowerLogin({ onLogin }: BlowerLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = BLOWER_USERS.find(
      (u) => u.username === username.toLowerCase().trim() && u.password === password
    );
    if (user) {
      onLogin(user.username);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -12, 12, -12, 12, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-600/20 mb-2">
            <Phone className="w-7 h-7 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Blower</h1>
          <p className="text-zinc-500 text-sm">Cold calling CRM</p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full h-14 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full h-14 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-[16px] placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full h-14 rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-semibold text-[16px] transition-colors"
        >
          Start Calling
        </button>
      </motion.form>
    </div>
  );
}
