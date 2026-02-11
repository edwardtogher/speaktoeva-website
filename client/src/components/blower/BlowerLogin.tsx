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
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -12, 12, -12, 12, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 mb-2">
              <Phone className="w-7 h-7 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">Blower</h1>
            <p className="text-zinc-500 text-sm">Cold calling CRM</p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full h-14 px-4 rounded-xl bg-[#F2F2F7] border-none text-zinc-900 text-[16px] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full h-14 px-4 rounded-xl bg-[#F2F2F7] border-none text-zinc-900 text-[16px] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-[16px] shadow-md transition-colors"
          >
            Start Calling
          </button>
        </div>
      </motion.form>
    </div>
  );
}
