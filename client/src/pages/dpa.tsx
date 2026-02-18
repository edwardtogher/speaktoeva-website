import LegalLayout from "@/components/legal/LegalLayout";
import { COMPANY_NAME, CONTACT_EMAIL, LAST_UPDATED } from "@/lib/constants";

const headings = [
  { id: "introduction", label: "Introduction and Scope" },
  { id: "definitions", label: "Definitions" },
  { id: "roles", label: "Roles" },
  { id: "processing-details", label: "Processing Details" },
  { id: "processor-obligations", label: "Processor Obligations" },
  { id: "sub-processors", label: "Sub-processors" },
  { id: "security", label: "Security Measures" },
  { id: "breach-notification", label: "Data Breach Notification" },
  { id: "data-subject-rights", label: "Data Subject Rights" },
  { id: "international-transfers", label: "International Transfers" },
  { id: "audit-rights", label: "Audit Rights" },
  { id: "term-and-termination", label: "Term and Termination" },
  { id: "contact", label: "Contact" },
];

export default function DpaPage() {
  return (
    <LegalLayout title="Data Processing Addendum" lastUpdated={LAST_UPDATED} headings={headings}>
      {/* 1. Introduction and Scope */}
      <section>
        <h2 id="introduction" className="scroll-mt-20">1. Introduction and Scope</h2>
        <p>
          This Data Processing Addendum ("DPA") supplements the{" "}
          <a href="/terms">Terms of Service</a> and applies when {COMPANY_NAME}{" "}
          processes personal data on the Customer's behalf in connection with the
          Service.
        </p>
        <p>
          This DPA is entered into by {COMPANY_NAME} and the Customer as
          identified in the Terms of Service. It sets out the parties' obligations
          regarding the protection of personal data processed in connection with
          the Service, in compliance with UK GDPR and the Data Protection Act
          2018.
        </p>
      </section>

      {/* 2. Definitions */}
      <section>
        <h2 id="definitions" className="scroll-mt-20">2. Definitions</h2>
        <ul>
          <li>
            <strong>"Controller"</strong> means the Customer, who determines the
            purposes and means of processing personal data.
          </li>
          <li>
            <strong>"Processor"</strong> means {COMPANY_NAME}, who processes
            personal data on behalf of the Controller.
          </li>
          <li>
            <strong>"Sub-processor"</strong> means a third party engaged by the
            Processor to process personal data.
          </li>
          <li>
            <strong>"Personal Data"</strong> means any information relating to an
            identified or identifiable natural person, as defined in UK GDPR.
          </li>
          <li>
            <strong>"Processing"</strong> means any operation performed on
            personal data, as defined in UK GDPR.
          </li>
          <li>
            <strong>"Data Subject"</strong> means the individual whose personal
            data is processed.
          </li>
          <li>
            Terms not defined here have the meanings given in the{" "}
            <a href="/terms">Terms of Service</a> or UK GDPR.
          </li>
        </ul>
      </section>

      {/* 3. Roles */}
      <section>
        <h2 id="roles" className="scroll-mt-20">3. Roles</h2>
        <p>
          The Customer is the Controller. {COMPANY_NAME} is the Processor.
        </p>
        <p>
          The Customer determines what personal data is processed and for what
          purposes. {COMPANY_NAME} processes personal data only on the Customer's
          documented instructions.
        </p>
      </section>

      {/* 4. Processing Details */}
      <section>
        <h2 id="processing-details" className="scroll-mt-20">4. Processing Details</h2>
        <p>
          The following table describes the processing carried out under this DPA:
        </p>
        <table>
          <thead>
            <tr>
              <th>Detail</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Subject matter</td>
              <td>
                Provision of AI voice agent services (call answering, message
                taking, appointment booking)
              </td>
            </tr>
            <tr>
              <td>Duration</td>
              <td>
                For the term of the agreement between Customer and{" "}
                {COMPANY_NAME}
              </td>
            </tr>
            <tr>
              <td>Nature and purpose</td>
              <td>
                Receiving and processing phone calls on Customer's behalf;
                recording calls; generating transcripts; taking messages; booking
                appointments; sending summaries to Customer
              </td>
            </tr>
            <tr>
              <td>Types of personal data</td>
              <td>
                Caller name, phone number, call recordings, call transcripts,
                appointment details, message content, email address (if provided
                by caller)
              </td>
            </tr>
            <tr>
              <td>Categories of data subjects</td>
              <td>
                Callers (individuals who phone the Customer's number and are
                answered by the Service)
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 5. Processor Obligations */}
      <section>
        <h2 id="processor-obligations" className="scroll-mt-20">5. Processor Obligations</h2>
        <p>
          As required by Article 28(3) of UK GDPR, {COMPANY_NAME} shall:
        </p>
        <ul>
          <li>
            Process personal data only on the Customer's documented instructions,
            unless required by law.
          </li>
          <li>
            Ensure that persons authorised to process personal data are bound by
            confidentiality obligations.
          </li>
          <li>
            Implement appropriate technical and organisational security measures.
          </li>
          <li>
            Not engage another processor (sub-processor) without prior written
            authorisation from the Customer (see Section 6).
          </li>
          <li>
            Assist the Customer in responding to data subject rights requests.
          </li>
          <li>
            Assist the Customer in ensuring compliance with data breach
            notification obligations.
          </li>
          <li>
            At the Customer's choice, delete or return all personal data on
            termination of the agreement.
          </li>
          <li>
            Make available to the Customer all information necessary to
            demonstrate compliance with Article 28 obligations.
          </li>
          <li>
            Allow for and contribute to audits conducted by the Customer or their
            appointed auditor.
          </li>
        </ul>
      </section>

      {/* 6. Sub-processors */}
      <section>
        <h2 id="sub-processors" className="scroll-mt-20">6. Sub-processors</h2>
        <p>
          The Customer authorises {COMPANY_NAME} to use the following
          sub-processors:
        </p>
        <table>
          <thead>
            <tr>
              <th>Sub-processor</th>
              <th>Purpose</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Retell AI</td>
              <td>AI call handling, recording, and transcription</td>
              <td>United States</td>
            </tr>
            <tr>
              <td>Railway</td>
              <td>Backend application hosting</td>
              <td>United States</td>
            </tr>
            <tr>
              <td>Google Workspace</td>
              <td>Email delivery (call summaries to Customer)</td>
              <td>United States</td>
            </tr>
            <tr>
              <td>Supabase</td>
              <td>Database hosting (caller data storage)</td>
              <td>United States</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Website hosting</td>
              <td>United States</td>
            </tr>
          </tbody>
        </table>
        <p>
          {COMPANY_NAME} will notify the Customer at least 30 days before adding
          or replacing a sub-processor. The Customer may object in writing within
          that period. If the objection cannot be resolved, the Customer may
          terminate the affected service.
        </p>
        <p>
          {COMPANY_NAME} shall ensure that each sub-processor is bound by data
          protection obligations no less protective than those in this DPA.
        </p>
      </section>

      {/* 7. Security Measures */}
      <section>
        <h2 id="security" className="scroll-mt-20">7. Security Measures</h2>
        <p>
          {COMPANY_NAME} implements appropriate technical and organisational
          measures to protect personal data, including:
        </p>
        <ul>
          <li>Encryption of personal data in transit (TLS) and at rest.</li>
          <li>
            Access controls limiting who can access personal data to authorised
            personnel only.
          </li>
          <li>
            Regular monitoring and logging of access to systems containing
            personal data.
          </li>
          <li>Secure deletion of data at the end of retention periods.</li>
          <li>Use of reputable, security-audited infrastructure providers.</li>
        </ul>
      </section>

      {/* 8. Data Breach Notification */}
      <section>
        <h2 id="breach-notification" className="scroll-mt-20">8. Data Breach Notification</h2>
        <p>
          {COMPANY_NAME} shall notify the Customer without undue delay (and in
          any event within 72 hours) after becoming aware of a personal data
          breach. The notification shall include:
        </p>
        <ul>
          <li>
            A description of the nature of the breach, including the categories
            and approximate number of data subjects and records affected.
          </li>
          <li>
            The name and contact details of the point of contact for further
            information.
          </li>
          <li>A description of the likely consequences of the breach.</li>
          <li>
            A description of the measures taken or proposed to address the
            breach.
          </li>
        </ul>
        <p>
          {COMPANY_NAME} shall cooperate with the Customer and take reasonable
          steps to assist in the investigation, mitigation, and remediation of
          the breach.
        </p>
      </section>

      {/* 9. Data Subject Rights */}
      <section>
        <h2 id="data-subject-rights" className="scroll-mt-20">9. Data Subject Rights</h2>
        <p>
          {COMPANY_NAME} shall assist the Customer in responding to requests from
          data subjects exercising their rights under UK GDPR, including the
          rights of access, rectification, erasure, restriction, portability, and
          objection.
        </p>
        <p>
          Where a data subject contacts {COMPANY_NAME} directly, we will promptly
          redirect them to the Customer unless instructed otherwise.
        </p>
      </section>

      {/* 10. International Transfers */}
      <section>
        <h2 id="international-transfers" className="scroll-mt-20">10. International Transfers</h2>
        <p>
          Where personal data is transferred outside the United Kingdom to
          sub-processors, {COMPANY_NAME} ensures appropriate safeguards are in
          place, including Standard Contractual Clauses (SCCs) as supplemented by
          the UK International Data Transfer Addendum (IDTA) where applicable.
        </p>
        <p>
          The Customer authorises such transfers subject to these safeguards.
        </p>
      </section>

      {/* 11. Audit Rights */}
      <section>
        <h2 id="audit-rights" className="scroll-mt-20">11. Audit Rights</h2>
        <p>
          The Customer may audit {COMPANY_NAME}'s compliance with this DPA by
          providing at least 30 days' written notice. Audits shall be conducted
          during normal business hours, no more than once per year (unless
          required by a supervisory authority or following a data breach), and
          shall not unreasonably disrupt {COMPANY_NAME}'s operations.
        </p>
        <p>
          The Customer shall bear its own costs for any audit. {COMPANY_NAME}{" "}
          shall provide reasonable cooperation and access to relevant information.
        </p>
      </section>

      {/* 12. Term and Termination */}
      <section>
        <h2 id="term-and-termination" className="scroll-mt-20">12. Term and Termination</h2>
        <p>
          This DPA is effective for the duration of the agreement between the
          Customer and {COMPANY_NAME}.
        </p>
        <p>
          On termination, {COMPANY_NAME} shall, at the Customer's written
          request, either delete or return all personal data within 30 days.
        </p>
        <p>
          {COMPANY_NAME} may retain personal data where required by applicable
          law, in which case the data protection obligations in this DPA continue
          to apply.
        </p>
      </section>

      {/* 13. Contact */}
      <section>
        <h2 id="contact" className="scroll-mt-20">13. Contact</h2>
        <p>
          For questions about this DPA or to exercise any rights under it,
          contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
