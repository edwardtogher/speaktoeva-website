import { useState } from "react";
import { FileText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface ScriptDrawerProps {
  batchId?: string;
}

function getOpening(batchId?: string): { location: string; caseStudy: string } {
  switch (batchId) {
    case "farnham-mobiles":
    case "farnham-landlines":
      return {
        location: "I'm based in Farnham",
        caseStudy: "We've been doing some work with a business up near Weydon School, if you know where that is",
      };
    case "wider-surrey":
      return {
        location: "I'm based in Surrey",
        caseStudy: "We've been doing some work with a clinic over in Farnham",
      };
    case "indeed-hiring":
    case "running-ads":
    default:
      return {
        location: "I'm based in Surrey",
        caseStudy: "We've been doing some work with an osteo clinic in London",
      };
  }
}

export default function ScriptDrawer({ batchId }: ScriptDrawerProps) {
  const [open, setOpen] = useState(false);
  const { location, caseStudy } = getOpening(batchId);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-blue-600 border border-blue-500 shadow-lg shadow-blue-500/20 flex items-center justify-center hover:bg-blue-500 active:bg-blue-700 transition-colors"
        aria-label="Open call script"
      >
        <FileText className="w-6 h-6 text-white" />
      </button>

      {/* Bottom Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="bg-zinc-950 border-zinc-800 max-h-[85vh] overflow-y-auto rounded-t-2xl"
        >
          <SheetHeader className="text-left mb-5">
            <SheetTitle className="text-white text-lg">Call Script</SheetTitle>
            <SheetDescription className="text-zinc-500 text-xs">
              Tap during a call for reference
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 pb-6">

            {/* 1. Opening */}
            <section className="rounded-xl bg-blue-950/40 border border-blue-800/40 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">1</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Opening
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-zinc-200">
                "Hey, how are you? So my name's Edward — I'll be honest, this is a cold call. Can I get <span className="text-blue-300 font-semibold">30 seconds</span>?"
              </p>
              <div className="mt-2.5 bg-zinc-900/60 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-500 italic">
                  If yes → go to Pitch. If "what's this about?" → go to Gatekeeper.
                </p>
              </div>
            </section>

            {/* 2. Gatekeeper */}
            <section className="rounded-xl bg-amber-950/30 border border-amber-800/30 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">2</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Gatekeeper
                </h3>
                <span className="text-[10px] text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">
                  IF NEEDED
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-zinc-200">
                "I'm just a local business, was hoping to have a quick word with the owner about their phones. <span className="text-amber-300 font-semibold">Are you the owner?</span>"
              </p>
              <div className="mt-2.5 bg-zinc-900/60 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-500 italic">
                  If not the owner: "No worries — who's best to speak to?" Get a name, move on.
                </p>
              </div>
            </section>

            {/* 3. Pitch */}
            <section className="rounded-xl bg-purple-950/30 border border-purple-800/30 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">3</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Pitch
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-zinc-200">
                "Yeah, so <span className="text-purple-300 font-semibold">{location}</span>. {caseStudy} —
                building them an AI receptionist to handle their incoming calls, texts, and emails.
                Basically making sure they <span className="text-purple-300 font-semibold">never miss an enquiry</span>."
              </p>
            </section>

            {/* 4. Demo Close */}
            <section className="rounded-xl bg-green-950/40 border border-green-800/40 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">4</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-green-400">
                  Demo Close
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-green-300 font-medium">
                "I've actually put together a personalised demo specifically for your clinic — could I send that over to you?"
              </p>
              <div className="mt-2.5 bg-green-900/20 rounded-lg px-3 py-2 border border-green-800/20">
                <p className="text-xs text-green-400/80 font-medium">
                  If yes: "Amazing — are you on WhatsApp on this number? I'll send it straight over."
                </p>
              </div>
            </section>

            {/* Objection Handlers */}
            <section className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">5</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Objection Handling
                </h3>
              </div>
              <Accordion type="single" collapsible className="space-y-1.5">
                <AccordionItem value="not-interested" className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40">
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "Not interested"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "Totally fair. Just out of curiosity — is it because you've got phone stuff sorted, or just
                    <span className="text-white font-semibold"> bad timing</span>?" If bad timing: "When's better to catch you?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="email" className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40">
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "Just send me an email"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "I can do that — but real talk, your inbox is probably rammed. I've got a
                    <span className="text-white font-semibold"> 60-second voice demo</span> I can WhatsApp you instead.
                    Way quicker than reading an email. Can I send that over?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="receptionist" className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40">
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "I already have a receptionist"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "Nice. What about <span className="text-white font-semibold">after hours and weekends</span>? That's when
                    a lot of online enquiries come through. Most clinics use Eva as the backup.
                    Worth a look at the demo?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40">
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "How much is it?"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "It's about <span className="text-white font-semibold">£250/mo</span> — less than a receptionist for one day a week,
                    and Eva works 24/7. Best thing is to hear her first though — if she sounds rubbish,
                    the price doesn't matter."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ai" className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40">
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "AI can't handle my patients"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "Most AI is terrible — I get it. That's why I built this differently. I've got a client
                    in London whose customers <span className="text-white font-semibold">ask for the AI by name</span>.
                    Have a listen to the demo and see what you think."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="think" className="border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40">
                  <AccordionTrigger className="text-sm text-red-300/80 px-3 py-2.5 hover:no-underline hover:bg-zinc-800/50">
                    "I need to think about it"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-[13px] px-3 leading-relaxed">
                    "Of course. Let me WhatsApp you the demo — have a listen when you've got
                    <span className="text-white font-semibold">60 seconds</span>. No pressure, just reply if you want to chat more."
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Stats */}
            <section className="rounded-xl bg-zinc-900/30 border border-zinc-800/30 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
                Stats to Drop
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📉</span>
                  <p className="text-[13px] text-zinc-400">85% of callers who get voicemail <span className="text-white font-medium">never call back</span></p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🏃</span>
                  <p className="text-[13px] text-zinc-400">78% of patients book with <span className="text-white font-medium">whoever answers first</span></p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">💰</span>
                  <p className="text-[13px] text-zinc-400">One extra patient/week at £50 and <span className="text-white font-medium">she's paid for herself</span></p>
                </div>
              </div>
            </section>

          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
