export type FaqItem = {
  id: string
}

/** Questions and answers are translated and live in `t.faq.items`, indexed by this same
 * order. */
export const FAQ_ITEMS: FaqItem[] = [
  { id: 'what-is' },
  { id: 'who-for' },
  { id: 'uzbekistan-only' },
  { id: 'brands-usage' },
  { id: 'creators-earn' },
  { id: 'onboarding-selective' },
]
