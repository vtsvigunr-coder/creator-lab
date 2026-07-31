import LegalPage, { type LegalSection } from './LegalPage'
import c from './legalContent.module.css'

const SECTIONS: LegalSection[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'definitions', label: 'Definitions' },
  { id: 'what-data-we-collect', label: 'What data we collect' },
  { id: 'how-we-use-your-data', label: 'How we use your data' },
  { id: 'how-we-share-your-data', label: 'How we share your data' },
  { id: 'international-data-transfers', label: 'International data transfers' },
  { id: 'data-retention', label: 'Data retention' },
  { id: 'your-rights', label: 'Your rights' },
  { id: 'cookies-and-tracking', label: 'Cookies and tracking technologies' },
  { id: 'data-security', label: 'Data security' },
  { id: 'childrens-privacy', label: "Children's privacy" },
  { id: 'financial-and-tax-data', label: 'Financial and tax data' },
  { id: 'changes-to-this-policy', label: 'Changes to this policy' },
  { id: 'contact-us', label: 'Contact us' },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="28 July 2026" sections={SECTIONS}>
      <section id="introduction" className={c.section}>
        <h2 className={c.heading}>Introduction</h2>
        <p className={c.paragraph}>
          Creator Lab (&ldquo;<span className={c.emphasis}>Creator Lab</span>,&rdquo; &ldquo;
          <span className={c.emphasis}>we</span>,&rdquo; &ldquo;<span className={c.emphasis}>us</span>,&rdquo; or
          &ldquo;<span className={c.emphasis}>our</span>&rdquo;) operates a platform that connects brands with
          creators, enabling brands to sell products and services through creator-driven marketing, and enabling
          creators to earn income through trackable products, trackable links, performance tracking, and payouts
          (the &ldquo;Service&rdquo;).
        </p>
        <p className={c.paragraph}>
          This Privacy Policy explains what personal data we collect from users of the Service — including{' '}
          <span className={c.emphasis}>Brands</span>, <span className={c.emphasis}>Creators</span>, and{' '}
          <span className={c.emphasis}>Site Visitors</span> — how we use it, who we share it with, and the choices
          and rights available to you. It applies to our website, web application, and any related services
          operated by Creator Lab (collectively, the &ldquo;Platform&rdquo;).
        </p>
        <p className={c.paragraph}>
          We are committed to processing personal data in accordance with the Law of the Republic of Uzbekistan
          &ldquo;On Personal Data&rdquo; (No. ZRU-547, dated 2 July 2019, as amended) and other applicable data
          protection legislation of the Republic of Uzbekistan.
        </p>
        <p className={c.paragraph}>
          <span className={c.label}>Data Controller:</span> [Creator Lab legal entity name], registered at
          [registered address], Republic of Uzbekistan.
          <br />
          <span className={c.label}>Contact:</span> [privacy@creatorlab.uz] / [support contact]
        </p>
        <p className={c.paragraph}>If you do not agree with this Privacy Policy, please do not use the Service.</p>
      </section>

      <section id="definitions" className={c.section}>
        <h2 className={c.heading}>Definitions</h2>
        <ul className={c.list}>
          <li>
            <span className={c.label}>Brand</span> — a business or individual entrepreneur that registers on the
            Platform to promote or sell products/services through Creators.
          </li>
          <li>
            <span className={c.label}>Creator</span> — an individual who registers on the Platform to promote Brand
            products, generate trackable links, and earn compensation based on performance.
          </li>
          <li>
            <span className={c.label}>Trackable Product / Trackable Link</span> — a unique product listing, referral
            link, promo code, or tracking pixel/identifier assigned to a Creator so that sales, clicks, and other
            activity can be attributed to them.
          </li>
          <li>
            <span className={c.label}>Payout</span> — any transfer of earned funds from Creator Lab (or a Brand, via
            Creator Lab) to a Creator.
          </li>
          <li>
            <span className={c.label}>Personal Data</span> — any information relating to an identified or
            identifiable natural person.
          </li>
        </ul>
      </section>

      <section id="what-data-we-collect" className={c.section}>
        <h2 className={c.heading}>What Data We Collect</h2>

        <h3 className={c.subheading}>3.1 Information you provide directly</h3>
        <div className={c.listGroup}>
          <h4 className={c.subsubheading}>All users (Brands and Creators):</h4>
          <ul className={c.list}>
            <li>Full name, email address, phone number, password/authentication credentials</li>
            <li>Company name, tax/business identification number (for Brands, e.g. INN/STIR), business address</li>
            <li>Profile information: profile photo, bio, category/niche, portfolio links</li>
            <li>Communications you send us (support requests, applications, disputes)</li>
          </ul>
        </div>
        <div className={c.listGroup}>
          <h4 className={c.subsubheading}>Creators specifically:</h4>
          <ul className={c.list}>
            <li>Date of birth / age confirmation (to verify eligibility, e.g. minimum age requirements)</li>
            <li>
              Government-issued ID or passport details, where required for identity verification (&ldquo;KYC&rdquo;)
              prior to payout, tax reporting, or fraud prevention
            </li>
            <li>
              Bank account details, card number, or e-wallet identifiers (e.g., Uzcard, Humo, Payme, Click) used to
              process payouts
            </li>
            <li>Tax residency status and information needed for tax withholding/reporting under Uzbek law</li>
            <li>
              Linked social media account handles and profile data (Instagram, Telegram, YouTube, TikTok, etc.)
              needed to verify audience and attribute performance
            </li>
            <li>Shipping address, where a Brand sends physical sample products</li>
          </ul>
        </div>
        <div className={c.listGroup}>
          <h4 className={c.subsubheading}>Brands specifically:</h4>
          <ul className={c.list}>
            <li>Billing and payment details for platform fees or campaign budgets</li>
            <li>Campaign briefs, product catalogs, pricing, and commission/payout terms set for Creators</li>
          </ul>
        </div>

        <h3 className={c.subheading}>3.2 Information collected automatically</h3>
        <ul className={c.list}>
          <li>
            <span className={c.label}>Device and usage data:</span> IP address, browser type, device identifiers,
            operating system, pages visited, referring URLs, timestamps
          </li>
          <li>
            <span className={c.label}>Cookies and similar technologies:</span> used for authentication, session
            management, analytics, and remembering preferences (see Section 9)
          </li>
          <li>
            <span className={c.label}>Performance and attribution data:</span> clicks, views, add-to-cart events,
            conversions, and sales generated through a Creator&rsquo;s trackable links or trackable products,
            including timestamps and (where available) the purchasing customer&rsquo;s order value and product
            selected — collected to calculate Creator commissions and performance metrics
          </li>
          <li>
            <span className={c.label}>Location data:</span> approximate location inferred from IP address, used for
            currency display, fraud prevention, and analytics
          </li>
        </ul>

        <h3 className={c.subheading}>3.3 Information from third parties</h3>
        <ul className={c.list}>
          <li>Data from payment processors and payout providers confirming transaction status</li>
          <li>
            Data from linked social media platforms (via OAuth or API), where you connect a social account to verify
            follower counts or engagement
          </li>
          <li>Data from identity-verification providers, where used for KYC checks</li>
          <li>
            Data from Brands or Creators about each other in the ordinary course of a collaboration (e.g., a Brand
            providing a Creator&rsquo;s agreed commission terms)
          </li>
        </ul>
      </section>

      <section id="how-we-use-your-data" className={c.section}>
        <h2 className={c.heading}>How We Use Your Data</h2>
        <p className={c.paragraph}>We use personal data to:</p>
        <ol className={c.list}>
          <li>Create and manage Brand and Creator accounts, and verify identity/eligibility</li>
          <li>
            Operate the marketplace: matching Brands and Creators, generating and tracking trackable
            products/links, and attributing sales and performance to the correct Creator
          </li>
          <li>
            Calculate, process, and report Creator earnings and Payouts, including any required tax withholding or
            reporting
          </li>
          <li>Process Brand payments and platform fees</li>
          <li>Provide customer support and respond to inquiries or disputes between Brands and Creators</li>
          <li>
            Send transactional notifications (order confirmations, payout confirmations, account alerts) and, with
            consent where required, marketing communications
          </li>
          <li>
            Monitor, analyze, and improve the Service, including performance dashboards shown to Brands and
            Creators
          </li>
          <li>Detect, investigate, and prevent fraud, abuse, click fraud, and violations of our Terms of Service</li>
          <li>
            Comply with legal obligations under Uzbek law, including tax, accounting, financial
            monitoring/anti-money-laundering, and consumer protection requirements
          </li>
          <li>
            Enforce our Terms of Service and protect the rights, property, and safety of Creator Lab, our users, and
            the public
          </li>
        </ol>
        <p className={c.paragraph}>
          <span className={c.label}>Legal bases</span> for processing include: performance of a contract with you
          (platform terms), your consent (e.g., marketing, optional social account linking), compliance with a legal
          obligation (e.g., tax/AML reporting), and our legitimate interests (e.g., fraud prevention, service
          improvement), balanced against your rights.
        </p>
      </section>

      <section id="how-we-share-your-data" className={c.section}>
        <h2 className={c.heading}>How We Share Your Data</h2>
        <p className={c.paragraph}>We do not sell personal data. We share personal data only as follows:</p>
        <ul className={c.list}>
          <li>
            <span className={c.emphasis}>Between Brands and Creators:</span> A Brand collaborating with a Creator
            can see the Creator&rsquo;s public profile, performance metrics relevant to their campaign, and
            information needed to fulfill the collaboration (e.g., shipping address for sample products). A Creator
            can see Brand campaign and product information necessary to promote it.
          </li>
          <li>
            <span className={c.emphasis}>Payment and payout providers:</span> banks, card networks, and local
            payment systems (e.g., Uzcard, Humo, Payme, Click) to process payouts and payments.
          </li>
          <li>
            <span className={c.emphasis}>Identity verification providers:</span> to confirm identity for
            KYC/fraud-prevention purposes.
          </li>
          <li>
            <span className={c.emphasis}>Service providers:</span> hosting, analytics, customer support, and
            communications vendors who process data on our behalf under confidentiality and data-processing
            obligations.
          </li>
          <li>
            <span className={c.emphasis}>Social media platforms:</span> where you connect a linked account, limited
            data may be exchanged with that platform under its own privacy policy and the permissions you grant.
          </li>
          <li>
            <span className={c.emphasis}>Legal and regulatory authorities:</span> where required by Uzbek law, court
            order, or to establish, exercise, or defend legal claims.
          </li>
          <li>
            <span className={c.emphasis}>Business transfers:</span> in connection with a merger, acquisition,
            financing, or sale of assets, subject to standard confidentiality protections.
          </li>
        </ul>
      </section>

      <section id="international-data-transfers" className={c.section}>
        <h2 className={c.heading}>International Data Transfers</h2>
        <p className={c.paragraph}>
          Where personal data is processed or stored on servers located outside the Republic of Uzbekistan, we take
          steps to ensure such transfers comply with the Law &ldquo;On Personal Data,&rdquo; including verifying
          that the receiving country provides an adequate level of protection or putting in place appropriate
          contractual safeguards.
        </p>
      </section>

      <section id="data-retention" className={c.section}>
        <h2 className={c.heading}>Data Retention</h2>
        <p className={c.paragraph}>
          We retain personal data for as long as your account is active and as necessary to provide the Service. We
          may retain certain data for longer periods where required to:
        </p>
        <ul className={c.list}>
          <li>Comply with tax, accounting, and financial recordkeeping obligations under Uzbek law</li>
          <li>Resolve disputes between Brands and Creators</li>
          <li>Enforce our agreements and Terms of Service</li>
          <li>Meet fraud-prevention and audit requirements</li>
        </ul>
        <p className={c.paragraph}>When no longer needed, personal data is deleted or anonymized.</p>
      </section>

      <section id="your-rights" className={c.section}>
        <h2 className={c.heading}>Your Rights</h2>
        <p className={c.paragraph}>Subject to applicable law, you have the right to:</p>
        <ul className={c.list}>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate or incomplete data</li>
          <li>
            Request deletion of your personal data, subject to legal retention requirements (e.g., completed payout
            and tax records)
          </li>
          <li>
            Withdraw consent at any time where processing is based on consent (e.g., marketing communications,
            linked social accounts)
          </li>
          <li>Object to certain processing, including profiling used for fraud prevention, where applicable</li>
          <li>Request a copy of your data in a portable format</li>
        </ul>
        <p className={c.paragraph}>
          To exercise these rights, contact us at [privacy@creatorlab.uz]. We may need to verify your identity
          before fulfilling a request.
        </p>
      </section>

      <section id="cookies-and-tracking" className={c.section}>
        <h2 className={c.heading}>Cookies and Tracking Technologies</h2>
        <p className={c.paragraph}>We use cookies, tracking pixels, and similar technologies to:</p>
        <ul className={c.list}>
          <li>Keep you signed in and maintain session security</li>
          <li>Remember preferences (e.g., language, currency)</li>
          <li>Attribute clicks and conversions to the correct Creator&rsquo;s trackable link or product</li>
          <li>Measure Platform usage and improve performance</li>
          <li>Support analytics and (where applicable) advertising</li>
        </ul>
        <p className={c.paragraph}>
          You can control cookies through your browser settings; disabling certain cookies may prevent trackable
          links from correctly attributing sales to a Creator, affecting their ability to earn commission.
        </p>
      </section>

      <section id="data-security" className={c.section}>
        <h2 className={c.heading}>Data Security</h2>
        <p className={c.paragraph}>
          We implement technical and organizational measures — including encryption in transit, access controls,
          and restricted access to payout and identity-verification data — designed to protect personal data against
          unauthorized access, loss, misuse, or alteration. No system is completely secure, and we cannot guarantee
          absolute security.
        </p>
      </section>

      <section id="childrens-privacy" className={c.section}>
        <h2 className={c.heading}>Children&rsquo;s Privacy</h2>
        <p className={c.paragraph}>
          The Service is not directed to individuals under the age of [16/18, per applicable local rules]. We do not
          knowingly collect personal data from children below this age. If we learn that we have collected such
          data, we will delete it.
        </p>
      </section>

      <section id="financial-and-tax-data" className={c.section}>
        <h2 className={c.heading}>Financial and Tax Data</h2>
        <p className={c.paragraph}>
          Because Creators earn compensation through the Platform, we collect and process the minimum financial and
          identity data necessary to issue Payouts and comply with Uzbek tax and financial-reporting obligations.
          This may include sharing relevant data with tax authorities or financial institutions as required by law.
          Bank/card details are processed by our payment/payout partners under their own security standards; we do
          not store full card numbers on our own servers beyond what is necessary to facilitate payouts.
        </p>
      </section>

      <section id="changes-to-this-policy" className={c.section}>
        <h2 className={c.heading}>Changes to This Policy</h2>
        <p className={c.paragraph}>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal
          requirements. We will post the updated version with a new &ldquo;Last updated&rdquo; date and, where
          changes are material, provide additional notice (e.g., email or in-app notification).
        </p>
      </section>

      <section id="contact-us" className={c.section}>
        <h2 className={c.heading}>Contact Us</h2>
        <p className={c.paragraph}>
          If you have questions or concerns about this Privacy Policy or our data practices, contact us at:
        </p>
        <address className={c.address}>
          <strong>Creator Lab</strong>
          [Registered legal entity name]
          <br />
          [Registered address, Republic of Uzbekistan]
          <br />
          <span className={c.label}>Email:</span> [privacy@creatorlab.uz]
        </address>
      </section>
    </LegalPage>
  )
}
