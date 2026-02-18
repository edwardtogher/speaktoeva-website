import LegalLayout from "@/components/legal/LegalLayout";
import { COMPANY_NAME, CONTACT_EMAIL, SITE_URL, LAST_UPDATED } from "@/lib/constants";

const headings = [
  { id: "introduction", label: "Introduction" },
  { id: "data-we-collect", label: "What Data We Collect" },
  { id: "how-we-use", label: "How We Use Your Data" },
  { id: "call-recording", label: "Call Recording" },
  { id: "cookies", label: "Cookies" },
  { id: "data-sharing", label: "Who We Share Data With" },
  { id: "international-transfers", label: "International Transfers" },
  { id: "data-retention", label: "Data Retention" },
  { id: "your-rights", label: "Your Rights" },
  { id: "childrens-data", label: "Children's Data" },
  { id: "automated-decisions", label: "Automated Decision-Making" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated={LAST_UPDATED} headings={headings}>
      {/* 1. Introduction */}
      <section>
        <h2 id="introduction">1. Introduction</h2>
        <p>
          {COMPANY_NAME} operates{" "}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE_URL}
          </a>
          . This Privacy Policy explains how we collect, use, and protect personal data when
          you interact with our website and services.
        </p>
        <p>This policy covers three groups of people:</p>
        <ul>
          <li>
            <strong>Website visitors</strong> — anyone who browses our website.
          </li>
          <li>
            <strong>Customers</strong> — businesses that use {COMPANY_NAME} to handle their
            phone calls.
          </li>
          <li>
            <strong>Callers</strong> — people who call our customers' phone numbers and are
            answered by Eva, our AI voice agent.
          </li>
        </ul>
        <p>
          {COMPANY_NAME} is the data controller for personal data collected from website
          visitors and for our own customer relationships.
        </p>
        <p>
          When we process caller data on behalf of our customers, we act as a data processor.
          The customer remains the data controller for their callers' data. Please see our{" "}
          <a href="/dpa">Data Processing Addendum</a> for details on this arrangement.
        </p>
      </section>

      {/* 2. What Data We Collect */}
      <section>
        <h2 id="data-we-collect">2. What Data We Collect</h2>
        <table>
          <thead>
            <tr>
              <th>Who</th>
              <th>What we collect</th>
              <th>How</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Website visitors</td>
              <td>Pages visited, device info, approximate location</td>
              <td>Vercel Analytics (cookie-based)</td>
            </tr>
            <tr>
              <td>Customers</td>
              <td>Name, email, phone, business name, billing info</td>
              <td>Account signup, invoicing</td>
            </tr>
            <tr>
              <td>Callers</td>
              <td>Name (if given), phone number, call recording, transcript, booking details</td>
              <td>During phone calls handled by Eva</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 3. How We Use Your Data */}
      <section>
        <h2 id="how-we-use">3. How We Use Your Data</h2>
        <table>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Data used</th>
              <th>Legal basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Deliver the Service (answer calls, take messages, book appointments)</td>
              <td>Caller data, customer config</td>
              <td>Contract performance</td>
            </tr>
            <tr>
              <td>Improve the Service</td>
              <td>Anonymised call patterns, usage analytics</td>
              <td>Legitimate interest</td>
            </tr>
            <tr>
              <td>Send service updates and invoices</td>
              <td>Customer email</td>
              <td>Contract performance</td>
            </tr>
            <tr>
              <td>Respond to enquiries</td>
              <td>Name, email, message content</td>
              <td>Legitimate interest</td>
            </tr>
            <tr>
              <td>Comply with legal obligations</td>
              <td>As required</td>
              <td>Legal obligation</td>
            </tr>
          </tbody>
        </table>
        <p>
          Where we process caller data as a processor on behalf of our customers, the legal
          basis for that processing is determined by the customer as controller.
        </p>
      </section>

      {/* 4. Call Recording */}
      <section>
        <h2 id="call-recording">4. Call Recording</h2>
        <p>
          Callers are informed at the start of each call that it may be recorded. Recordings
          are used to deliver the Service, including message-taking, appointment booking, and
          producing accurate call summaries.
        </p>
        <p>
          Call recordings and transcripts are retained for 90 days from the date of the call
          and are then automatically deleted.
        </p>
        <p>
          Customers can request earlier deletion of recordings by contacting us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      {/* 5. Cookies */}
      <section>
        <h2 id="cookies">5. Cookies</h2>
        <p>
          This website uses Vercel Analytics cookies to understand how visitors use the site.
          These are first-party analytics cookies.
        </p>
        <p>We do not use advertising or tracking cookies.</p>
        <p>
          You can manage your cookie preferences using the banner shown when you first visit
          the site, or by clearing cookies in your browser settings.
        </p>
      </section>

      {/* 6. Who We Share Data With */}
      <section>
        <h2 id="data-sharing">6. Who We Share Data With</h2>
        <p>
          We share data only with service providers (sub-processors) who help us deliver the
          Service:
        </p>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Retell AI</td>
              <td>AI call handling and recording</td>
              <td>United States</td>
            </tr>
            <tr>
              <td>Railway</td>
              <td>Backend application hosting</td>
              <td>United States</td>
            </tr>
            <tr>
              <td>Google Workspace</td>
              <td>Email delivery and business tools</td>
              <td>United States</td>
            </tr>
            <tr>
              <td>Supabase</td>
              <td>Database hosting</td>
              <td>United States</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Website hosting and analytics</td>
              <td>United States</td>
            </tr>
          </tbody>
        </table>
        <p>We do not sell personal data.</p>
        <p>
          We may disclose data if required by law or to protect our legal rights.
        </p>
      </section>

      {/* 7. International Transfers */}
      <section>
        <h2 id="international-transfers">7. International Transfers</h2>
        <p>
          Some of our sub-processors are based in the United States. Where personal data is
          transferred outside the UK, we ensure appropriate safeguards are in place, including
          Standard Contractual Clauses (SCCs) as supplemented by the UK International Data
          Transfer Addendum (IDTA) where applicable.
        </p>
      </section>

      {/* 8. Data Retention */}
      <section>
        <h2 id="data-retention">8. Data Retention</h2>
        <ul>
          <li>
            <strong>Call recordings and transcripts:</strong> 90 days from the date of the
            call
          </li>
          <li>
            <strong>Customer account data:</strong> for the duration of the contract plus 30
            days
          </li>
          <li>
            <strong>Website analytics:</strong> aggregated, no personally identifiable data
            retained
          </li>
          <li>
            <strong>Enquiry/contact data:</strong> 12 months from last communication
          </li>
        </ul>
        <p>After these periods, data is securely deleted or anonymised.</p>
      </section>

      {/* 9. Your Rights */}
      <section>
        <h2 id="your-rights">9. Your Rights</h2>
        <p>Under UK GDPR, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Erase your data (right to be forgotten)</li>
          <li>Restrict processing</li>
          <li>Data portability</li>
          <li>Object to processing</li>
          <li>Withdraw consent (where processing is based on consent)</li>
          <li>Lodge a complaint with the ICO</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          You can also contact the Information Commissioner's Office (ICO):{" "}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
            ico.org.uk
          </a>
          , helpline 0303 123 1113.
        </p>
      </section>

      {/* 10. Children's Data */}
      <section>
        <h2 id="childrens-data">10. Children's Data</h2>
        <p>
          Our Service is designed for businesses and is not directed at individuals under 18.
          We do not knowingly collect personal data from children.
        </p>
      </section>

      {/* 11. Automated Decision-Making */}
      <section>
        <h2 id="automated-decisions">11. Automated Decision-Making</h2>
        <p>
          We do not use personal data for automated decision-making or profiling that produces
          legal or similarly significant effects on individuals. While Eva uses AI to handle
          phone calls, this is service delivery and does not involve decisions about individuals'
          legal rights or status.
        </p>
      </section>

      {/* 12. Changes to This Policy */}
      <section>
        <h2 id="changes">12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes will be
          communicated via email to customers and updated on this page with a new "Last
          updated" date.
        </p>
      </section>

      {/* 12. Contact */}
      <section>
        <h2 id="contact">13. Contact</h2>
        <p>
          If you have questions about this Privacy Policy or how we handle your data, contact
          us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
