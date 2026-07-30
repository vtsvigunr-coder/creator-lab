import type { Translations } from '../types'

export const en: Translations = {
  nav: {
    sitemap: {
      howItWorks: 'How It Works',
      forBrands: 'For Brands',
      forCreators: 'For Creators',
      faq: 'FAQ',
    },
    legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    sitemapTitle: 'Sitemap',
    legalTitle: 'Legal',
    socialTitle: 'Social',
    menuLabel: 'Menu',
    closeLabel: 'Close',
    getStarted: 'Get Started',
  },
  header: {
    accountAlt: 'Account',
    getStarted: 'Get Started',
  },
  hero: {
    titleLine1: 'The operating system',
    titleLine2: 'for creator-led commerce',
    inWord: 'in',
    markerWord: 'Uzbekistan',
    description:
      'Creator Lab helps brands sell through creators, and helps creators earn through trackable products, links, payouts, and performance',
    applyAsBrand: 'Apply as a Brand',
    applyAsCreator: 'Apply as a Creator',
  },
  problem: {
    tag: 'Problem',
    introLine1: 'Social commerce',
    introLine2: 'is already here',
    introDescription:
      'Across Uzbekistan, brands are selling through Instagram, Telegram, and direct messages. Creators are influencing buying decisions every day. Customers are discovering products through content, stories, and recommendations.',
    outroLine1: 'But the system behind it',
    outroIsStill: 'is still',
    outroFragmented: 'fragmented.',
    outroDescription:
      'Brands struggle with manual sales flows, weak attribution, and inconsistent fulfillment. Creators drive traffic and demand without clear visibility into performance, earnings, or long-term upside. Too much commerce is happening informally, and too much value gets lost in the process.',
    footnote: 'Creator Lab is built to fix that.',
  },
  solution: {
    tag: 'What Creator Lab does',
    headingLine1: 'One platform for brands,',
    headingLine2: 'creators, and commerce',
    description: 'Creator Lab brings together the three parts of modern creator-led sales into one system',
    cta: 'See How It Works',
    slides: [
      { label: 'For brands', caption: 'List products, activate creators, track performance, and centralize creator-driven sales.' },
      { label: 'For creators', caption: 'Monetize influence through trusted products, performance visibility, and structured payouts' },
      { label: 'For the platform', caption: 'Track attribution, manage billing, handle payout logic, and create a cleaner economic system for both sides' },
    ],
  },
  howItWorks: {
    tag: 'How it works',
    headingBeforeIcon: 'Simple on',
    headingAfterIcon: 'the outside.',
    headingLine2: 'Powerful underneath.',
    cta: 'Explore the System',
    steps: [
      { title: ['Brands', 'join'], description: 'Brands onboard products and prepare campaigns through Creator Lab', badge: 'step 1' },
      { title: ['Creators', 'promote'], description: 'Creators receive access to products, campaigns, and trackable links.', badge: 'step 2' },
      { title: ['Customers', 'discover and buy'], description: 'Customers move from creator content to product pages, traffic flows, and purchases', badge: 'step 3' },
      { title: ['Creator Lab', 'manages the system'], description: 'Attribution, billing, payout, and performance are managed through a shared infrastructure', badge: 'step 4' },
    ],
  },
  forBrands: {
    tag: 'Why brands join',
    headingLine1: 'Turn creators into',
    headingLine2: 'a real sales channel',
    description:
      'Creator Lab gives brands a better way to sell through creators without relying on scattered messages, spreadsheet chaos, or blind influencer deals',
    listHeading: 'With Creator Lab, brands can:',
    canList: [
      'List products in one system',
      'Activate relevant creators',
      'Track clicks, visits, and sales',
      'Understand which creators actually drive results',
      'Centralize creator-led demand into one operational flow',
    ],
    cta: 'For Brands',
    stats: [{ label: 'Clicks' }, { label: 'Visits' }, { label: 'Sales' }],
  },
  forCreators: {
    tag: 'Why creators join',
    headingLine1: 'Turn influence into',
    headingLine2: 'structured income',
    description: 'Creators should not have to rely on random deals, unclear terms, and late payments to earn online',
    listHeading: 'Creator Lab gives creators a more professional path:',
    canList: [
      'Access to brand and product opportunities',
      'A verified creator profile',
      'Trackable links and campaign visibility',
      'Earnings clarity',
      'Long-term reputation and growth inside a real ecosystem',
    ],
    cta: 'For Creators',
    trackedLinkLabel: 'Your tracked link',
    earningsLabel: 'Earnings this month',
  },
  ourPlatform: {
    heading: 'Track every sale. Reward every creator',
    chipLabel: 'Our platform',
    cta: 'Explore the Platform',
    tabs: [
      { label: 'For Brand', captionLines: ['Launch creator campaigns', 'and track every sale clearly.'] },
      { label: 'For Creators', captionLines: ['Share links and see', 'earnings in real time'] },
      { label: 'For the Platform', captionLines: ['Manage brands, creators, products', 'campaigns, and payouts centrally'] },
    ],
  },
  whyNow: {
    headingBeforeImg: 'Built for',
    headingAfterImg: 'the reality',
    headingLine2: 'of Uzbekistan',
    description: "Creator Lab is designed for the local market, not copied from someone else's playbook",
    conditionsLabel: 'We understand the real operating conditions:',
    heroHeading: 'Social-first product discovery',
    bento: [
      'DM-based selling habits',
      'Fragmented creator-brand relationships',
      'Weak tracking and informal reporting',
      'Demand for better commerce systems',
    ],
  },
  whyCreatorsJoin: {
    tag: 'Why creators join',
    headingLine1: 'Not for everyone.',
    headingLine2: 'For serious players.',
    description:
      'Creator Lab is built for brands that want real sales, and creators who want long-term value. We are building a curated ecosystem for:',
    slides: [
      { caption: 'Brands ready to scale through creators' },
      { caption: 'Creators building trust and long-term income' },
      { caption: 'Partners shaping where commerce is headed' },
    ],
  },
  faq: {
    heading: 'Frequently Asked Questions',
    copyLine1: 'Still have questions?',
    copyLine2: "If you are considering Creator Lab as a brand, creator, or partner, we'd be happy to speak",
    cta: 'Chat with Us',
    items: [
      {
        question: 'What is Creator Lab?',
        answer:
          'Creator Lab is the operating system for creator-led commerce — it connects brands and creators through trackable links, real sales data, and transparent, on-time payouts.',
      },
      {
        question: 'Who is Creator Lab for?',
        answer:
          'Creator Lab is built for brands that want to scale through creators, and for creators who want a more professional way to monetize their influence',
      },
      {
        question: 'Is Creator Lab only for Uzbekistan?',
        answer:
          'Creator Lab is built first for the Uzbekistan market, but the platform is designed to expand into other Central Asian markets as the ecosystem grows.',
      },
      {
        question: 'How do brands use Creator Lab?',
        answer:
          'Brands list products, activate relevant creators, and assign them trackable links, then monitor clicks, sales, and payouts from a single dashboard.',
      },
      {
        question: 'How do creators earn?',
        answer:
          'Creators earn commission on every tracked sale generated through their unique links, with transparent, on-time payouts based on real performance.',
      },
      {
        question: 'Is onboarding selective?',
        answer:
          'Yes. We review every brand and creator application to keep the ecosystem high-quality and focused on serious, long-term partners.',
      },
    ],
  },
  ctaFooter: {
    headingLines: ['Join the next', 'layer of commerce', 'in Uzbekistan'],
    description:
      'Whether you are a brand looking for scalable distribution or a creator looking for structured monetization, Creator Lab is where the system works.',
    applyAsBrand: 'Apply as a Brand',
    applyAsCreator: 'Apply as a Creator',
    copyright: '© 2026 Creator Lab. All rights reserved.',
  },
}
