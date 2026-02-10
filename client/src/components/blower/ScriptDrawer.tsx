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
              Tap the script icon during a call for reference
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 text-[14px] text-zinc-300 pb-6">
            {/* Gatekeeper */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Gatekeeper ("what's this regarding?")
              </h3>
              <p className="leading-relaxed">
                "I'm just a local business, was hoping for a quick word with the owner about their
                phones. Is he/she around?"
              </p>
              <p className="text-zinc-500 text-xs mt-1 italic">
                Don't pitch the receptionist. If owner's not there, ask when's best to catch them.
              </p>
            </section>

            {/* Opening */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Opening
              </h3>
              <p className="leading-relaxed">
                "Hi there, have I reached <b className="text-white">[clinic name]</b>?
                Great — am I speaking to the owner?"
              </p>
              <p className="text-zinc-500 text-xs mt-1 italic">
                If not the owner: "No worries — who's best to speak to about this?" Get a name, move on.
              </p>
            </section>

            {/* Pitch */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Pitch
              </h3>
              <p className="leading-relaxed">
                "I'm Ed — I'll be honest, this is a cold call. Can I get <b className="text-white">30 seconds</b>?"
              </p>
              <p className="text-zinc-500 text-xs mt-1 italic">
                Wait for yes.
              </p>
              <p className="leading-relaxed mt-3">
                "Yeah, so <b className="text-white">{location}</b>. {caseStudy} —
                building them an AI receptionist to handle their incoming calls, texts, and emails.
                Basically making sure they <b className="text-white">never miss an enquiry</b>."
              </p>
            </section>

            {/* Demo close */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Demo Close
              </h3>
              <p className="leading-relaxed text-green-400 font-medium">
                "I've actually put together a personalised demo specifically for{" "}
                <b className="text-white">[clinic name]</b> — could I send that over to you?"
              </p>
              <p className="text-zinc-500 text-xs mt-1 italic">
                If yes: "Amazing — are you on WhatsApp on this number? I'll send it straight over."
              </p>
            </section>

            {/* Objection Handlers */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Objection Handling
              </h3>
              <Accordion type="single" collapsible className="space-y-1">
                <AccordionItem value="not-interested" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "Not interested"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "Totally fair. Just out of curiosity — is it because you've got phone stuff sorted, or just
                    <b className="text-white"> bad timing</b>?" If bad timing: "When's better to catch you?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="email" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "Just send me an email"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "I can do that — but real talk, your inbox is probably rammed. I've got a
                    <b className="text-white"> 60-second voice demo</b> I can WhatsApp you instead.
                    Way quicker than reading an email. Can I send that over?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="receptionist" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "I already have a receptionist"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "Nice. What about <b className="text-white">after hours and weekends</b>? That's when
                    a lot of online enquiries come through. Most clinics use Eva as the backup.
                    Worth a look at the demo?"
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "How much is it?"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "It's about <b className="text-white">£250/mo</b> — less than a receptionist for one day a week,
                    and Eva works 24/7. Best thing is to hear her first though — if she sounds rubbish,
                    the price doesn't matter."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ai" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "AI can't handle my patients"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "Most AI is terrible — I get it. That's why I built this differently. I've got a client
                    in London whose customers <b className="text-white">ask for the AI by name</b>.
                    Have a listen to the demo and see what you think."
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="think" className="border-zinc-800 rounded-lg overflow-hidden">
                  <AccordionTrigger className="text-sm text-zinc-300 px-3 py-2 hover:no-underline hover:bg-zinc-900">
                    "I need to think about it"
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 px-3">
                    "Of course. Let me WhatsApp you the demo — have a listen when you've got
                    <b className="text-white">60 seconds</b>. No pressure, just reply if you want to chat more."
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Stats */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Stats to Drop
              </h3>
              <ul className="space-y-1 text-zinc-400 text-[13px]">
                <li>85% of callers who get voicemail never call back</li>
                <li>78% of patients book with whoever answers first</li>
                <li>One extra patient a week at £50 and she's paid for herself</li>
              </ul>
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
