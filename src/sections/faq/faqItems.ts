export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is',
    question: 'What is Creator Lab?',
    answer:
      'Creator Lab is the operating system for creator-led commerce — it connects brands and creators through trackable links, real sales data, and transparent, on-time payouts.',
  },
  {
    id: 'who-for',
    question: 'Who is Creator Lab for?',
    answer:
      'Creator Lab is built for brands that want to scale through creators, and for creators who want a more professional way to monetize their influence',
  },
  {
    id: 'uzbekistan-only',
    question: 'Is Creator Lab only for Uzbekistan?',
    answer:
      "Creator Lab is built first for the Uzbekistan market, but the platform is designed to expand into other Central Asian markets as the ecosystem grows.",
  },
  {
    id: 'brands-usage',
    question: 'How do brands use Creator Lab?',
    answer:
      'Brands list products, activate relevant creators, and assign them trackable links, then monitor clicks, sales, and payouts from a single dashboard.',
  },
  {
    id: 'creators-earn',
    question: 'How do creators earn?',
    answer:
      'Creators earn commission on every tracked sale generated through their unique links, with transparent, on-time payouts based on real performance.',
  },
  {
    id: 'onboarding-selective',
    question: 'Is onboarding selective?',
    answer:
      'Yes. We review every brand and creator application to keep the ecosystem high-quality and focused on serious, long-term partners.',
  },
]
