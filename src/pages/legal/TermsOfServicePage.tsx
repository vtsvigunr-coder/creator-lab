import LegalPage, { type LegalSection } from './LegalPage'
import c from './legalContent.module.css'

const SECTIONS: LegalSection[] = [
  { id: 'introduction-and-acceptance', label: 'Introduction and Acceptance' },
  { id: 'definitions', label: 'Definitions' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'brand-obligations', label: 'Brand obligations' },
  { id: 'creator-obligations', label: 'Creator obligations' },
  { id: 'trackable-links-products-and-attribution', label: 'Trackable links, products, and attribution' },
  { id: 'payments-fees-and-payouts', label: 'Payments, fees, and payouts' },
  { id: 'fees-and-commission-changes', label: 'Fees and commission changes' },
  { id: 'content-and-intellectual-property', label: 'Content and intellectual property' },
  { id: 'prohibited-conduct', label: 'Prohibited conduct' },
  { id: 'third-party-platforms-and-services', label: 'Third-party platforms and services' },
  { id: 'disclaimers', label: 'Disclaimers' },
  { id: 'limitation-of-liability', label: 'Limitation of liability' },
  { id: 'indemnification', label: 'Indemnification' },
  { id: 'suspension-and-termination', label: 'Suspension and termination' },
  { id: 'changes-to-the-platform-and-terms', label: 'Changes to the platform and terms' },
  { id: 'dispute-resolution', label: 'Dispute resolution' },
  { id: 'governing-law', label: 'Governing law' },
  { id: 'miscellaneous', label: 'Miscellaneous' },
  { id: 'contact-us', label: 'Contact us' },
]

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Use" lastUpdated="28 July 2026" sections={SECTIONS}>
      <section id="introduction-and-acceptance" className={c.section}>
        <h2 className={c.heading}>Introduction and Acceptance</h2>
        <p className={c.paragraph}>
          These Terms of Use (&ldquo;<span className={c.emphasis}>Terms</span>&rdquo;) govern access to and use of
          the Creator Lab website, web application, and related services (collectively, the &ldquo;
          <span className={c.emphasis}>Platform</span>&rdquo; or &ldquo;
          <span className={c.emphasis}>Service</span>&rdquo;), operated by [Creator Lab legal entity name] (&ldquo;
          <span className={c.emphasis}>Creator Lab</span>,&rdquo; &ldquo;<span className={c.emphasis}>we</span>
          ,&rdquo; &ldquo;<span className={c.emphasis}>us</span>,&rdquo; or &ldquo;
          <span className={c.emphasis}>our</span>&rdquo;), registered at [registered address], Republic of
          Uzbekistan.
        </p>
        <p className={c.paragraph}>
          The Platform connects Brands (businesses selling products or services) with Creators (individuals who
          promote and sell those products/services through trackable products, links, and content) and facilitates
          tracking, attribution, and payouts related to that activity.
        </p>
        <p className={c.paragraph}>
          By creating an account, accessing, or using the Platform, you (&ldquo;User&rdquo;) agree to be bound by
          these Terms and our <span className={c.emphasis}>Privacy Policy</span>, which is incorporated by
          reference. If you do not agree, do not use the Platform.
        </p>
        <p className={c.paragraph}>
          If you are using the Platform on behalf of a company or other legal entity, you represent that you have
          authority to bind that entity, and &ldquo;you&rdquo; refers to that entity.
        </p>
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
          <li>
            <span className={c.label}>Content</span> — any text, images, video, links, or other material a User
            submits, posts, or shares through the Platform, including creator promotional content.
          </li>
        </ul>
      </section>

      <section id="eligibility" className={c.section}>
        <h2 className={c.heading}>Eligibility</h2>
        <p className={c.paragraph}>To use the Platform, you must:</p>
        <ul className={c.list}>
          <li>Be at least [16/18] years old, or the age of majority in your jurisdiction, whichever is higher;</li>
          <li>Have the legal capacity to enter into a binding contract;</li>
          <li>Not be barred from using the Platform under applicable law, including Uzbek law; and</li>
          <li>Provide accurate, current, and complete registration information.</li>
        </ul>
        <p className={c.paragraph}>
          Brands must be a duly registered legal entity or individual entrepreneur under the laws of the Republic of
          Uzbekistan (or their home jurisdiction, where applicable) and provide valid business/tax identification
          details where required.
        </p>
      </section>

      <section id="accounts" className={c.section}>
        <h2 className={c.heading}>Accounts</h2>
        <ul className={c.list}>
          <li>
            You are responsible for maintaining the confidentiality of your login credentials and for all activity
            under your account.
          </li>
          <li>You must notify us promptly of any unauthorized use of your account.</li>
          <li>
            We may suspend or terminate accounts that provide false information, violate these Terms, or are used
            fraudulently.
          </li>
          <li>
            One person or entity may not maintain multiple duplicate accounts to circumvent Platform limits,
            commission structures, or bans, unless expressly authorized by us.
          </li>
        </ul>
      </section>

      <section id="brand-obligations" className={c.section}>
        <h2 className={c.heading}>Brand Obligations</h2>
        <p className={c.paragraph}>Brands using the Platform agree to:</p>
        <ul className={c.list}>
          <li>Provide accurate product information, pricing, inventory, and commission/payout terms for each Campaign;</li>
          <li>Honor the commission rates and payout terms agreed with Creators for attributed sales;</li>
          <li>
            Fulfill orders generated through Trackable Links/Products in accordance with applicable
            consumer-protection law;
          </li>
          <li>Not manipulate, suppress, or falsify tracking data to reduce or avoid Creator compensation;</li>
          <li>
            Comply with applicable advertising, product-safety, and consumer-protection laws for any product or
            service listed;
          </li>
          <li>Pay all applicable Platform fees in a timely manner.</li>
        </ul>
      </section>

      <section id="creator-obligations" className={c.section}>
        <h2 className={c.heading}>Creator Obligations</h2>
        <p className={c.paragraph}>Creators using the Platform agree to:</p>
        <ul className={c.list}>
          <li>
            Only promote products/services through Trackable Links/Products as authorized by the relevant Brand and
            Campaign terms;
          </li>
          <li>
            Not engage in click fraud, self-purchasing to inflate commissions, incentivized fraud, bot traffic, or
            any other manipulation of tracking or attribution data;
          </li>
          <li>
            Disclose sponsored or affiliate content in accordance with applicable advertising-disclosure laws and
            the platform policies of any third-party social network used (e.g., Instagram, Telegram, YouTube,
            TikTok);
          </li>
          <li>Not make false, misleading, or unauthorized claims about a Brand&rsquo;s products or services;</li>
          <li>Provide accurate identity, tax, and payout information necessary to receive Payouts;</li>
          <li>
            Comply with the content and community guidelines of any third-party platform on which promotional
            content is posted.
          </li>
        </ul>
      </section>

      <section id="trackable-links-products-and-attribution" className={c.section}>
        <h2 className={c.heading}>Trackable Links, Products, and Attribution</h2>
        <ul className={c.list}>
          <li>Creator Lab assigns unique Trackable Links/Products to Creators to attribute clicks, views, and sales.</li>
          <li>
            Commission is calculated based on attributed activity as recorded by our tracking systems, subject to
            the specific Campaign terms agreed between the Brand and Creator.
          </li>
          <li>
            We use commercially reasonable methods to detect and prevent fraudulent, duplicate, or manipulated
            attribution (e.g., bot traffic, cookie stuffing, self-referrals). We reserve the right to withhold,
            reverse, or deny commission for activity we reasonably believe to be fraudulent or in violation of these
            Terms.
          </li>
          <li>Attribution windows, cookie duration, and commission calculation rules are specified per Campaign and may vary.</li>
        </ul>
      </section>

      <section id="payments-fees-and-payouts" className={c.section}>
        <h2 className={c.heading}>Payments, Fees, and Payouts</h2>
        <ul className={c.list}>
          <li>
            <span className={c.label}>Brand fees:</span> Brands agree to pay Platform fees, Campaign budgets, and
            Creator commissions as set out in the applicable order or Campaign terms.
          </li>
          <li>
            <span className={c.label}>Creator payouts:</span> Creator Lab will process Payouts to Creators based on
            verified attributed performance, subject to any minimum payout threshold, applicable taxes, and
            processing timelines disclosed on the Platform.
          </li>
          <li>
            <span className={c.label}>Payment methods:</span> Payments and Payouts are processed through third-party
            payment and payout providers (e.g., Uzcard, Humo, Payme, Click, or bank transfer). Creator Lab is not
            responsible for delays or errors caused by these third parties.
          </li>
          <li>
            <span className={c.label}>Taxes:</span> Each User is responsible for determining and satisfying their
            own tax obligations arising from use of the Platform, including any income tax on Creator earnings.
            Creator Lab may withhold or report amounts where required by Uzbek law.
          </li>
          <li>
            <span className={c.label}>Disputes and chargebacks:</span> Payout amounts may be withheld pending
            resolution of a dispute, suspected fraud investigation, or a Brand&rsquo;s failure to fund a Campaign.
          </li>
          <li>
            <span className={c.label}>Refunds:</span> Refund eligibility for end-customer purchases is governed by
            the applicable Brand&rsquo;s own refund/return policy, unless otherwise stated.
          </li>
        </ul>
      </section>

      <section id="fees-and-commission-changes" className={c.section}>
        <h2 className={c.heading}>Fees and Commission Changes</h2>
        <p className={c.paragraph}>
          We may charge platform, transaction, or service fees as disclosed on the Platform at the time of the
          relevant transaction. We may modify our fee structure with prior notice; changes apply prospectively to
          new Campaigns/transactions unless otherwise stated.
        </p>
      </section>

      <section id="content-and-intellectual-property" className={c.section}>
        <h2 className={c.heading}>Content and Intellectual Property</h2>
        <ul className={c.list}>
          <li>
            <span className={c.label}>Your content:</span> You retain ownership of Content you submit. By posting
            Content on the Platform, you grant Creator Lab a non-exclusive, worldwide, royalty-free license to
            host, display, reproduce, and distribute that Content as necessary to operate and promote the Platform.
          </li>
          <li>
            <span className={c.label}>Brand materials:</span> Brands grant Creators a limited, non-exclusive license
            to use provided product images, descriptions, and marketing assets solely for the purpose of promoting
            the Brand&rsquo;s products under an active Campaign.
          </li>
          <li>
            <span className={c.label}>Platform IP:</span> The Platform, including its software, design, trademarks,
            and logos, is owned by Creator Lab or its licensors and protected by applicable intellectual property
            laws. You may not copy, modify, reverse-engineer, or create derivative works from the Platform without
            our prior written consent.
          </li>
          <li>
            <span className={c.label}>Reporting infringement:</span> If you believe Content on the Platform
            infringes your intellectual property rights, contact us at [legal@creatorlab.uz] with details of the
            alleged infringement.
          </li>
        </ul>
      </section>

      <section id="prohibited-conduct" className={c.section}>
        <h2 className={c.heading}>Prohibited Conduct</h2>
        <p className={c.paragraph}>You agree not to:</p>
        <ul className={c.list}>
          <li>Violate any applicable law or regulation, including Uzbek consumer-protection, advertising, tax, and anti-money-laundering law;</li>
          <li>Engage in fraud, including click fraud, fake reviews, fake engagement, or manipulated attribution;</li>
          <li>Upload harmful code, malware, or attempt to gain unauthorized access to the Platform or other Users&rsquo; accounts;</li>
          <li>Promote illegal, counterfeit, or prohibited products or services;</li>
          <li>Harass, defame, or discriminate against other Users;</li>
          <li>
            Circumvent the Platform to transact directly with a Brand/Creator to avoid fees, where such
            circumvention breaches an active Campaign agreement;
          </li>
          <li>Scrape, crawl, or extract data from the Platform other than through provided interfaces/APIs.</li>
        </ul>
        <p className={c.paragraph}>
          We reserve the right to investigate and take appropriate action, including suspension, termination,
          withholding of funds, and reporting to law enforcement, for violations of this section.
        </p>
      </section>

      <section id="third-party-platforms-and-services" className={c.section}>
        <h2 className={c.heading}>Third-Party Platforms and Services</h2>
        <p className={c.paragraph}>
          The Service may involve integration with third-party platforms (e.g., social media networks, payment
          processors). Your use of those platforms is governed by their own terms and privacy policies. Creator Lab
          is not responsible for the availability, content, or practices of third-party services.
        </p>
      </section>

      <section id="disclaimers" className={c.section}>
        <h2 className={c.heading}>Disclaimers</h2>
        <ul className={c.list}>
          <li>
            The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any
            kind, express or implied, including merchantability, fitness for a particular purpose, or
            non-infringement, to the maximum extent permitted by law.
          </li>
          <li>
            Creator Lab does not guarantee any specific level of earnings, sales, traffic, or engagement for
            Creators, nor any specific volume of sales or Creators for Brands.
          </li>
          <li>
            Creator Lab is not a party to the underlying sale between a Brand and an end customer and does not
            guarantee product quality, safety, or fulfillment; that responsibility rests with the Brand.
          </li>
        </ul>
      </section>

      <section id="limitation-of-liability" className={c.section}>
        <h2 className={c.heading}>Limitation of Liability</h2>
        <p className={c.paragraph}>To the maximum extent permitted by applicable Uzbek law:</p>
        <ul className={c.list}>
          <li>
            Creator Lab&rsquo;s aggregate liability arising out of or relating to these Terms or the Platform shall
            not exceed the greater of (a) the fees paid by/to you through the Platform in the [3] months preceding
            the claim, or (b) [amount/equivalent in UZS], as applicable.
          </li>
          <li>
            Creator Lab shall not be liable for indirect, incidental, special, consequential, or punitive damages,
            including lost profits or lost data, arising from use of the Platform.
          </li>
          <li>
            Nothing in these Terms limits liability that cannot be excluded or limited under applicable Uzbek law
            (e.g., liability for willful misconduct or gross negligence).
          </li>
        </ul>
      </section>

      <section id="indemnification" className={c.section}>
        <h2 className={c.heading}>Indemnification</h2>
        <p className={c.paragraph}>
          You agree to indemnify and hold harmless Creator Lab, its officers, employees, and agents from any claims,
          damages, losses, and expenses (including reasonable legal fees) arising from: (a) your breach of these
          Terms; (b) your Content; (c) your violation of applicable law; or (d) your interactions or transactions
          with other Users.
        </p>
      </section>

      <section id="suspension-and-termination" className={c.section}>
        <h2 className={c.heading}>Suspension and Termination</h2>
        <ul className={c.list}>
          <li>
            You may close your account at any time by contacting us or through account settings, subject to
            settlement of any outstanding Payouts or Brand obligations.
          </li>
          <li>
            We may suspend or terminate your account, with or without notice, for violation of these Terms,
            suspected fraud, legal requirements, or extended inactivity.
          </li>
          <li>
            Upon termination, outstanding, verified Creator earnings will be paid out subject to standard processing
            timelines and any pending fraud/dispute investigations. Provisions that by their nature should survive
            termination (e.g., Sections 10, 14, 15) will survive.
          </li>
        </ul>
      </section>

      <section id="changes-to-the-platform-and-terms" className={c.section}>
        <h2 className={c.heading}>Changes to the Platform and Terms</h2>
        <p className={c.paragraph}>
          We may modify these Terms from time to time. We will post the updated Terms with a new &ldquo;Last
          updated&rdquo; date and, for material changes, provide additional notice (e.g., email or in-app
          notification). Continued use of the Platform after changes take effect constitutes acceptance of the
          revised Terms. We may also modify, suspend, or discontinue any part of the Platform at our discretion.
        </p>
      </section>

      <section id="dispute-resolution" className={c.section}>
        <h2 className={c.heading}>Dispute Resolution</h2>
        <ul className={c.list}>
          <li>
            <span className={c.label}>Brand&ndash;Creator disputes:</span> Users should first attempt to resolve
            disputes arising from a Campaign directly. Creator Lab may, at its discretion, assist in mediating such
            disputes but is not obligated to act as arbitrator.
          </li>
          <li>
            <span className={c.label}>Disputes with Creator Lab:</span> Any dispute arising out of or relating to
            these Terms shall first be addressed through good-faith negotiation. If unresolved within [30] days, the
            dispute shall be submitted to the competent courts of the Republic of Uzbekistan, unless mandatory law
            provides otherwise.
          </li>
        </ul>
      </section>

      <section id="governing-law" className={c.section}>
        <h2 className={c.heading}>Governing Law</h2>
        <p className={c.paragraph}>
          These Terms are governed by the laws of the Republic of Uzbekistan, without regard to conflict-of-law
          principles.
        </p>
      </section>

      <section id="miscellaneous" className={c.section}>
        <h2 className={c.heading}>Miscellaneous</h2>
        <ul className={c.list}>
          <li>
            <span className={c.label}>Entire agreement:</span> These Terms, together with the Privacy Policy and any
            Campaign-specific terms, constitute the entire agreement between you and Creator Lab regarding the
            Platform.
          </li>
          <li>
            <span className={c.label}>Severability:</span> If any provision is found unenforceable, the remaining
            provisions remain in full effect.
          </li>
          <li>
            <span className={c.label}>No waiver:</span> Failure to enforce any provision is not a waiver of our
            right to do so later.
          </li>
          <li>
            <span className={c.label}>Assignment:</span> You may not assign these Terms without our consent; we may
            assign these Terms in connection with a merger, acquisition, or sale of assets.
          </li>
          <li>
            <span className={c.label}>Notices:</span> We may provide notices via email, in-app notification, or
            posting on the Platform.
          </li>
        </ul>
      </section>

      <section id="contact-us" className={c.section}>
        <h2 className={c.heading}>Contact Us</h2>
        <p className={c.paragraph}>For questions about these Terms, contact:</p>
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
