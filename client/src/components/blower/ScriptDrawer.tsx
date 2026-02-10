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

export default function ScriptDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 shadow-lg flex items-center justify-center hover:bg-zinc-700 active:bg-zinc-600 transition-colors"
        aria-label="Open call script"
      >
        <FileText className="w-6 h-6 text-zinc-300" />
      </button>

      {/* Bottom Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="bg-zinc-950 border-zinc-800 max-h-[85vh] overflow-y-auto rounded-t-2xl"
        >
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="text-white">Call Script</SheetTitle>
            <SheetDescription className="text-zinc-500">
              UK Physio / Chiro / Osteo cold call
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 text-[14px] text-zinc-300 pb-6">
            {/* Opening */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Opening
              </h3>
              <p className="leading-relaxed">
                "Hi, is this <b className="text-white">[NAME]</b>? Hey [NAME], my name's Edward -
                I'm actually just down the road in Farnham. I've been chatting to a few clinics
                in the area about something I've built. Have you got <b className="text-white">30 seconds</b>?"
              </p>
            </section>

            {/* Bridge */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Bridge Question
              </h3>
              <p className="leading-relaxed text-green-400 font-medium">
                "When you're in sessions with patients, what happens to your phone calls?"
              </p>
              <p className="text-zinc-500 text-xs mt-1 italic">
                SHUT UP AND LISTEN. Let them tell you their pain.
              </p>
            </section>

            {/* Pivot - Calls missed */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Pivot (calls get missed)
              </h3>
              <p className="leading-relaxed">
                "Yeah, that's literally what every clinic says. So I've built this{" "}
                <b className="text-white">AI receptionist called Eva</b> - she picks up every call,
                sounds like a real person, and books patients straight into your calendar.{" "}
                <b className="text-white">One extra patient a week</b> at 50 quid and she's paid for herself.
                I could even <b className="text-white">pop over and show you</b> - I'm only 10 minutes away."
              </p>
            </section>

            {/* Pivot - Voicemail */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Pivot (goes to voicemail)
              </h3>
              <p className="leading-relaxed">
                "How many of those people actually leave a message?{" "}
                <b className="text-white">85% just hang up</b> and ring the next clinic.
                You're losing patients you don't even know about. That's exactly why I built Eva."
              </p>
            </section>

            {/* Objection Handlers */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Objection Handling
              </h3>
              <Accordion type="single" collapsible className="space-y-1">
                <AccordionItem value="price" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "How much is it?"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "It's <b className="text-white">$299/mo</b>. Less than a receptionist for one day a week, and Eva works 24/7.
                    Best thing is to hear her first - if she sounds rubbish, the price doesn't matter."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ai" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "AI can't handle my patients"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "Most AI is terrible - I get it. Eva's different. I built one for a company in London and their
                    customers <b className="text-white">ask for her by name</b>.
                    I can call your phone right now and you can hear her."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="email" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "Just send me an email"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "I can do that. Real talk though - your inbox is probably rammed. Before I send something you'll
                    never read, is it <b className="text-white">bad timing or genuinely not interested</b>? Either's fine."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="think" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "I need to think about it"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "Of course. I'll send you a link so you can <b className="text-white">hear Eva for yourself</b> when
                    you've got two minutes. Then just reply if you want to chat more. No pressure."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="receptionist" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "I already have a receptionist"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "Nice. What about <b className="text-white">after 5 or weekends</b>? That's when a lot of online
                    enquiries come through. Most clinics use Eva as the after-hours backup."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="not-interested" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "Not interested" (brush-off)
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "Totally fair. Just out of curiosity - is it because you've got phone stuff sorted, or just
                    <b className="text-white"> bad timing</b>?" If bad timing: "When's better to catch you?"
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Close */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Close (they want a demo)
              </h3>
              <p className="leading-relaxed">
                "I'm literally down the road. I could <b className="text-white">swing by one morning this week</b> and
                show you on my laptop. Takes 10 minutes, I'll bring coffee.{" "}
                <b className="text-white">What day works for you?</b>"
              </p>
            </section>

            {/* Stats */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Stats to Drop
              </h3>
              <ul className="space-y-1 text-zinc-400 text-[13px]">
                <li>85% of callers who get voicemail never call back</li>
                <li>78% of patients book with whoever answers first</li>
                <li>Average missed call costs a small business $1,200</li>
                <li>Solo physio missing 2 calls/week = $100+/week lost</li>
              </ul>
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
