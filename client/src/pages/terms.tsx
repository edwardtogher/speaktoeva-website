import LegalLayout from "@/components/legal/LegalLayout";
import { COMPANY_NAME, CONTACT_EMAIL, SITE_URL, JURISDICTION, LAST_UPDATED } from "@/lib/constants";

const headings = [
  { id: "introduction", label: "Introduction" },
  { id: "definitions", label: "Definitions" },
  { id: "the-service", label: "The Service" },
  { id: "account-and-eligibility", label: "Account and Eligibility" },
  { id: "fees-and-payment", label: "Fees and Payment" },
  { id: "your-responsibilities", label: "Your Responsibilities" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "data-and-privacy", label: "Data and Privacy" },
  { id: "call-recordings", label: "Call Recordings" },
  { id: "service-availability", label: "Service Availability" },
  { id: "limitation-of-liability", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "suspension-and-termination", label: "Suspension and Termination" },
  { id: "changes-to-terms", label: "Changes to Terms" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated={LAST_UPDATED} headings={headings}>
      {/* 1. Introduction */}
      <section>
        <h2 id="introduction" className="scroll-mt-20">1. Introduction</h2>
        <p>
          {COMPANY_NAME} ("we", "us", "our") operates the website at{" "}
          <a href={SITE_URL}>{SITE_URL}</a> and provides an AI-powered voice
          agent service that answers phone calls on behalf of businesses.
        </p>
        <p>
          These Terms of Service ("Terms") govern your access to and use of our
          Service. By using the Service, you agree to be bound by these Terms. If
          you do not agree, please do not use the Service.
        </p>
      </section>

      {/* 2. Definitions */}
      <section>
        <h2 id="definitions" className="scroll-mt-20">2. Definitions</h2>
        <ul>
          <li>
            <strong>Service</strong> — the AI voice agent platform provided by{" "}
            {COMPANY_NAME}, including all related software, tools, and support.
          </li>
          <li>
            <strong>Customer</strong> — the business or organisation that signs
            up to use the Service.
          </li>
          <li>
            <strong>End User</strong> — any person who accesses or uses the
            Service on behalf of a Customer (for example, a team member or
            administrator).
          </li>
          <li>
            <strong>Caller</strong> — any person who calls a Customer's phone
            number and is answered by Eva, our AI voice agent.
          </li>
          <li>
            <strong>Caller Data</strong> — any information collected during
            calls, including call recordings, transcripts, and contact details
            provided by Callers.
          </li>
        </ul>
      </section>

      {/* 3. The Service */}
      <section>
        <h2 id="the-service" className="scroll-mt-20">3. The Service</h2>
        <p>
          {COMPANY_NAME} provides an AI voice agent ("Eva") that answers phone
          calls on behalf of Customers. Eva can:
        </p>
        <ul>
          <li>Take messages and relay them to the Customer</li>
          <li>Book appointments and manage scheduling</li>
          <li>Handle common enquiries using information provided by the Customer</li>
          <li>Collect caller details such as name, phone number, and reason for calling</li>
        </ul>
        <p>
          We continuously develop and improve the Service. We may add, modify, or
          remove features from time to time. Where changes materially affect your
          use of the Service, we will give you reasonable notice.
        </p>
      </section>

      {/* 4. Account and Eligibility */}
      <section>
        <h2 id="account-and-eligibility" className="scroll-mt-20">4. Account and Eligibility</h2>
        <p>To use the Service, you must:</p>
        <ul>
          <li>Be a UK-based business or an authorised representative of one</li>
          <li>Be at least 18 years old</li>
          <li>Provide accurate and complete information when setting up your account</li>
          <li>Keep your login credentials secure and confidential</li>
        </ul>
        <p>
          You are responsible for all activity that occurs under your account. If
          you become aware of any unauthorised use, please contact us immediately
          at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      {/* 5. Fees and Payment */}
      <section>
        <h2 id="fees-and-payment" className="scroll-mt-20">5. Fees and Payment</h2>
        <ul>
          <li>
            Pricing is agreed on a per-customer basis as set out in your contract
            or proposal.
          </li>
          <li>Invoices are issued and payable as agreed in your contract.</li>
          <li>
            All fees are exclusive of VAT unless explicitly stated otherwise.
          </li>
          <li>
            Late or missed payments may result in suspension of the Service until
            the outstanding balance is settled.
          </li>
        </ul>
      </section>

      {/* 6. Your Responsibilities */}
      <section>
        <h2 id="your-responsibilities" className="scroll-mt-20">6. Your Responsibilities</h2>
        <p>As a Customer, you agree to:</p>
        <ul>
          <li>
            Provide accurate and up-to-date business information and
            call-handling instructions so Eva can represent your business
            correctly.
          </li>
          <li>
            Ensure your use of the Service complies with all applicable laws and
            regulations.
          </li>
          <li>
            Inform callers that their calls may be answered by an AI agent where
            you are legally required to do so.
          </li>
          <li>Not use the Service for any unlawful, fraudulent, or harmful purpose.</li>
        </ul>
      </section>

      {/* 7. Acceptable Use */}
      <section>
        <h2 id="acceptable-use" className="scroll-mt-20">7. Acceptable Use</h2>
        <p>You must not use the Service to:</p>
        <ul>
          <li>Harass, threaten, or abuse any person</li>
          <li>Engage in fraud, deception, or any illegal activity</li>
          <li>Send spam or make unsolicited bulk calls</li>
          <li>
            Record calls in a manner that violates applicable laws or without
            proper consent
          </li>
          <li>
            Reverse engineer, decompile, or disassemble any part of the Service
          </li>
          <li>
            Attempt to extract, copy, or replicate the AI models or algorithms
            used by the Service
          </li>
          <li>
            Mislead callers about the nature of the Service (i.e. concealing that
            they are speaking to an AI) where you are legally required to disclose
            this
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate access for any Customer
          found to be in breach of this section.
        </p>
      </section>

      {/* 8. Intellectual Property */}
      <section>
        <h2 id="intellectual-property" className="scroll-mt-20">8. Intellectual Property</h2>
        <p>
          All intellectual property rights in the Service — including branding,
          software, AI models, and documentation — belong to {COMPANY_NAME} or
          our licensors. Nothing in these Terms transfers any IP rights to you.
        </p>
        <p>
          You retain full ownership of your business data and any Caller Data
          collected through your use of the Service.
        </p>
      </section>

      {/* 9. Data and Privacy */}
      <section>
        <h2 id="data-and-privacy" className="scroll-mt-20">9. Data and Privacy</h2>
        <p>
          We take data protection seriously. We process personal data in
          accordance with our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
        <p>
          Where we process personal data on your behalf (for example, Caller
          Data), our{" "}
          <a href="/dpa">Data Processing Addendum</a> applies. The DPA sets out
          the roles, responsibilities, and safeguards for that processing.
        </p>
      </section>

      {/* 10. Call Recordings */}
      <section>
        <h2 id="call-recordings" className="scroll-mt-20">10. Call Recordings</h2>
        <p>
          Calls handled by Eva are recorded in order to deliver and improve the
          Service. Callers are informed at the start of each call that the call
          may be recorded.
        </p>
        <ul>
          <li>
            Call recordings and transcripts are retained for <strong>90 days</strong>,
            after which they are automatically deleted.
          </li>
          <li>
            Customers can request earlier deletion of their call recordings at
            any time by contacting us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </li>
        </ul>
      </section>

      {/* 11. Service Availability */}
      <section>
        <h2 id="service-availability" className="scroll-mt-20">11. Service Availability</h2>
        <p>
          We use reasonable efforts to keep the Service available at all times,
          but we do not guarantee 100% uptime. The Service may be temporarily
          unavailable due to:
        </p>
        <ul>
          <li>Planned maintenance (we will communicate this in advance where possible)</li>
          <li>Unplanned outages or technical issues</li>
          <li>Problems with third-party providers (telephony, hosting, AI infrastructure)</li>
        </ul>
        <p>
          We are not liable for any losses arising from downtime caused by events
          outside our reasonable control.
        </p>
      </section>

      {/* 12. Limitation of Liability */}
      <section>
        <h2 id="limitation-of-liability" className="scroll-mt-20">12. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law:</p>
        <ul>
          <li>
            Our total liability to you for any claims arising out of or relating
            to these Terms or the Service is capped at the total fees paid by you
            to {COMPANY_NAME} in the <strong>12 months</strong> immediately
            before the event giving rise to the claim.
          </li>
          <li>
            We are not liable for any indirect, consequential, or incidental
            losses, including but not limited to lost profits, lost revenue, lost
            data, or business interruption.
          </li>
        </ul>
        <p>
          Nothing in these Terms excludes or limits liability for death or
          personal injury caused by negligence, fraud or fraudulent
          misrepresentation, or any other liability that cannot be excluded or
          limited by law.
        </p>
      </section>

      {/* 13. Indemnification */}
      <section>
        <h2 id="indemnification" className="scroll-mt-20">13. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless {COMPANY_NAME}, its
          directors, employees, and agents against any claims, losses, damages,
          or expenses (including reasonable legal fees) arising from:
        </p>
        <ul>
          <li>Your misuse of the Service</li>
          <li>Your breach of these Terms</li>
          <li>Your violation of any applicable law or regulation</li>
          <li>
            Any claim by a third party resulting from your use of the Service
          </li>
        </ul>
      </section>

      {/* 14. Suspension and Termination */}
      <section>
        <h2 id="suspension-and-termination" className="scroll-mt-20">14. Suspension and Termination</h2>
        <p>
          Either party may terminate the agreement by giving{" "}
          <strong>30 days' written notice</strong> to the other party.
        </p>
        <p>
          We may suspend or terminate your access to the Service immediately and
          without notice if:
        </p>
        <ul>
          <li>You breach these Terms</li>
          <li>Payment is overdue and remains unpaid after a reasonable reminder</li>
          <li>We reasonably believe the Service is being used for illegal activity</li>
        </ul>
        <p>
          On termination, your access to the Service will end. Any Caller Data
          and business data will be handled in accordance with our{" "}
          <a href="/dpa">Data Processing Addendum</a>.
        </p>
      </section>

      {/* 15. Changes to Terms */}
      <section>
        <h2 id="changes-to-terms" className="scroll-mt-20">15. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. If we make material
          changes, we will notify you at least <strong>30 days in advance</strong>{" "}
          via email.
        </p>
        <p>
          Continued use of the Service after the updated Terms take effect
          constitutes your acceptance of those changes. If you do not agree with
          the updated Terms, you should stop using the Service before they take
          effect.
        </p>
      </section>

      {/* 16. Governing Law */}
      <section>
        <h2 id="governing-law" className="scroll-mt-20">16. Governing Law</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of{" "}
          {JURISDICTION}.
        </p>
        <p>
          Any disputes arising out of or in connection with these Terms shall be
          subject to the exclusive jurisdiction of the courts of {JURISDICTION}.
        </p>
      </section>

      {/* 17. Contact */}
      <section>
        <h2 id="contact" className="scroll-mt-20">17. Contact</h2>
        <p>
          If you have any questions about these Terms, please get in touch:
        </p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>
    </LegalLayout>
  );
}
