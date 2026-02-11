/**
 * Shared script data module — single source of truth for all cold call script content.
 * Used by both ScriptsSection (reference view) and CallingMode (active call view).
 */

import type { ReactNode } from "react";

// --- Opening ---

export function ScriptOpening() {
  return (
    <p className="text-[15px] leading-relaxed text-zinc-800">
      "Hey, how are you? So my name's Edward — I'll be honest, this is a cold call. Can I
      get <span className="text-blue-600 font-semibold">30 seconds</span>?"
    </p>
  );
}

export function ScriptOpeningHint() {
  return (
    <p className="text-xs text-zinc-500 italic">
      If yes - go to Pitch. If "what's this about?" - go to Gatekeeper.
    </p>
  );
}

// --- Gatekeeper ---

export function ScriptGatekeeper() {
  return (
    <p className="text-[15px] leading-relaxed text-zinc-800">
      "I'm just a local business, was hoping to have a quick word with the owner about
      their phones.{" "}
      <span className="text-amber-600 font-semibold">Are you the owner?</span>"
    </p>
  );
}

export function ScriptGatekeeperHint() {
  return (
    <p className="text-xs text-zinc-500 italic">
      If not the owner: "No worries — who's best to speak to?" Get a name, move on.
    </p>
  );
}

// --- Callback Opening ---

export function ScriptCallbackOpening({
  accentColor = "text-amber-600",
}: {
  accentColor?: string;
}) {
  return (
    <p className="text-[15px] leading-relaxed text-zinc-800">
      "Oh hey,{" "}
      <span className={`${accentColor} font-semibold`}>cheers for ringing back</span>.
      Sorry, I'm not actually a patient — bit of a cold call. I'm Ed, I'm based just
      down the road in Farnham.{" "}
      <span className={`${accentColor} font-semibold`}>Have you got 30 seconds?</span>"
    </p>
  );
}

export function ScriptCallbackOpeningHint() {
  return (
    <p className="text-xs text-zinc-500 italic">
      If yes → go straight to Pitch below. Same script from here.
    </p>
  );
}

// --- Calling Back NOW Opening (uses same callback text but teal accent) ---

export function ScriptCallingBackNowOpening() {
  return <ScriptCallbackOpening accentColor="text-teal-600" />;
}

// --- Calling Back NOW Pitch (unique hook) ---

export function ScriptCallingBackNowPitch() {
  return (
    <p className="text-[15px] leading-relaxed text-zinc-800">
      "So I've built an AI receptionist for physio clinics — answers your calls when
      you're with patients, books people in. You just called me back from a missed call,
      which is{" "}
      <span className="text-teal-600 font-semibold">
        kinda the exact problem it solves
      </span>
      . Worth a quick chat?"
    </p>
  );
}

// --- Pitch ---

export function ScriptPitch({
  location = "I'm based in Farnham",
  caseStudy = "[Case study]",
}: {
  location?: string;
  caseStudy?: string;
}) {
  return (
    <p className="text-[15px] leading-relaxed text-zinc-800">
      "Yeah, so{" "}
      <span className="text-purple-600 font-semibold">{location}</span>. {caseStudy} —
      building them an AI receptionist to handle their incoming calls, texts, and emails.
      Basically making sure they{" "}
      <span className="text-purple-600 font-semibold">never miss an enquiry</span>."
    </p>
  );
}

// --- Demo Close ---

export function ScriptDemoClose() {
  return (
    <p className="text-[15px] leading-relaxed text-green-700 font-medium">
      "I've actually put together a personalised demo specifically for your clinic —
      could I send that over to you?"
    </p>
  );
}

// --- Close (WhatsApp send) ---

export function ScriptClose() {
  return (
    <p className="text-[15px] leading-relaxed text-emerald-700 font-medium">
      "Amazing — are you on WhatsApp on this number? I'll send it straight over."
    </p>
  );
}

// --- Objections ---

export interface Objection {
  trigger: string;
  response: ReactNode;
}

export const OBJECTIONS: Objection[] = [
  {
    trigger: "I just call them back",
    response: (
      <p className="text-zinc-700 text-[13px] leading-relaxed">
        "Yeah, but when your{" "}
        <span className="text-zinc-900 font-semibold">patients</span> ring and nobody picks
        up — do they wait? Or do they just Google the next physio and book there?"
      </p>
    ),
  },
  {
    trigger: "Not interested",
    response: (
      <p className="text-zinc-700 text-[13px] leading-relaxed">
        "Totally fair. Just out of curiosity — is it because you've got phone stuff
        sorted, or just
        <span className="text-zinc-900 font-semibold"> bad timing</span>?" If bad timing:
        "When's better to catch you?"
      </p>
    ),
  },
  {
    trigger: "Just send me an email",
    response: (
      <p className="text-zinc-700 text-[13px] leading-relaxed">
        "I can do that — but real talk, your inbox is probably rammed. I've got a
        <span className="text-zinc-900 font-semibold"> 60-second voice demo</span> I can
        WhatsApp you instead. Way quicker than reading an email. Can I send that over?"
      </p>
    ),
  },
  {
    trigger: "I already have a receptionist",
    response: (
      <p className="text-zinc-700 text-[13px] leading-relaxed">
        "Nice. What about{" "}
        <span className="text-zinc-900 font-semibold">after hours and weekends</span>?
        That's when a lot of online enquiries come through. Most clinics use Eva as the
        backup. Worth a look at the demo?"
      </p>
    ),
  },
  {
    trigger: "How much is it?",
    response: (
      <p className="text-zinc-700 text-[13px] leading-relaxed">
        "It's about{" "}
        <span className="text-zinc-900 font-semibold">&pound;250/mo</span> — less than a
        receptionist for one day a week, and Eva works 24/7. Best thing is to hear her
        first though — if she sounds rubbish, the price doesn't matter."
      </p>
    ),
  },
  {
    trigger: "AI can't handle my patients",
    response: (
      <p className="text-zinc-700 text-[13px] leading-relaxed">
        "Most AI is terrible — I get it. That's why I built this differently. I've got a
        client in London whose customers{" "}
        <span className="text-zinc-900 font-semibold">ask for the AI by name</span>. Have a
        listen to the demo and see what you think."
      </p>
    ),
  },
  {
    trigger: "I need to think about it",
    response: (
      <p className="text-zinc-700 text-[13px] leading-relaxed">
        "Of course. Let me WhatsApp you the demo — have a listen when you've got
        <span className="text-zinc-900 font-semibold"> 60 seconds</span>. No pressure, just
        reply if you want to chat more."
      </p>
    ),
  },
];

export function ScriptObjections() {
  return (
    <div className="space-y-2">
      {OBJECTIONS.map((obj) => (
        <div
          key={obj.trigger}
          className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5"
        >
          <p className="text-sm text-red-500 font-medium mb-1">"{obj.trigger}"</p>
          {obj.response}
        </div>
      ))}
    </div>
  );
}

// --- Stats ---

export interface Stat {
  text: ReactNode;
}

export const STATS: Stat[] = [
  {
    text: (
      <p className="text-[14px] text-zinc-500">
        85% of callers who get voicemail{" "}
        <span className="text-zinc-900 font-medium">never call back</span>
      </p>
    ),
  },
  {
    text: (
      <p className="text-[14px] text-zinc-500">
        78% of patients book with{" "}
        <span className="text-zinc-900 font-medium">whoever answers first</span>
      </p>
    ),
  },
  {
    text: (
      <p className="text-[14px] text-zinc-500">
        One extra patient/week at &pound;50 and{" "}
        <span className="text-zinc-900 font-medium">she's paid for herself</span>
      </p>
    ),
  },
];

export function ScriptStats() {
  return (
    <div className="space-y-2.5">
      {STATS.map((stat, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <span className="text-sm text-zinc-500 mt-0.5">{i + 1}.</span>
          {stat.text}
        </div>
      ))}
    </div>
  );
}
