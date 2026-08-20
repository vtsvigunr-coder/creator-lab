/** `titleMobile` is optional: the mobile frames break the last two steps' titles elsewhere. */
type Step = { title: [string, string]; titleMobile?: [string, string]; description: string; badge: string }

export interface Translations {
  nav: {
    sitemap: {
      howItWorks: string
      forBrands: string
      forCreators: string
      faq: string
    }
    legal: [string, string, string]
    sitemapTitle: string
    legalTitle: string
    socialTitle: string
    menuLabel: string
    closeLabel: string
    getStarted: string
  }
  header: {
    accountAlt: string
    getStarted: string
  }
  hero: {
    titleLine1: string
    titleLine2: string
    /** Optional: the mobile frame splits the second line in two. Omit to keep one line. */
    titleLine2Mobile?: [string, string]
    inWord: string
    markerWord: string
    description: string
    applyAsBrand: string
    applyAsCreator: string
  }
  problem: {
    tag: string
    introLine1: string
    introLine2: string
    /** Optional: mobile runs the two intro lines together as one wrapping paragraph. */
    introFlowsOnMobile?: boolean
    /** Optional: mobile pulls "is still" up into the first paragraph, leaving the glass plate
        holding only the last word. */
    outroIsStillJoinsMobile?: boolean
    introDescription: string
    outroLine1: string
    outroIsStill: string
    outroFragmented: string
    outroDescription: string
    footnote: string
  }
  solution: {
    tag: string
    headingLine1: string
    headingLine2: string
    /** Optional: the mobile frame breaks the same heading into three lines. */
    headingLinesMobile?: [string, string, string]
    description: string
    cta: string
    slides: [
      { label: string; caption: string },
      { label: string; caption: string },
      { label: string; caption: string },
    ]
  }
  howItWorks: {
    tag: string
    headingBeforeIcon: string
    headingAfterIcon: string
    headingLine2: string
    cta: string
    steps: [
      Step,
      Step,
      Step,
      Step,
    ]
  }
  forBrands: {
    tag: string
    headingLine1: string
    headingLine2: string
    /** Optional: the mobile frame breaks the same heading into three lines. */
    headingLinesMobile?: [string, string, string]
    description: string
    listHeading: string
    canList: [string, string, string, string, string]
    cta: string
    stats: [{ label: string }, { label: string }, { label: string }]
  }
  forCreators: {
    tag: string
    headingLine1: string
    headingLine2: string
    /** Optional: mobile runs the two lines together as one wrapping paragraph. */
    headingFlowsOnMobile?: boolean
    description: string
    listHeading: string
    canList: [string, string, string, string, string]
    cta: string
    trackedLinkLabel: string
    earningsLabel: string
  }
  ourPlatform: {
    heading: string
    chipLabel: string
    cta: string
    tabs: [
      { label: string; captionLines: [string, string] },
      { label: string; captionLines: [string, string] },
      { label: string; captionLines: [string, string] },
    ]
  }
  whyNow: {
    headingBeforeImg: string
    headingAfterImg: string
    headingLine2: string
    description: string
    conditionsLabel: string
    heroHeading: string
    bento: [string, string, string, string]
  }
  whyCreatorsJoin: {
    tag: string
    headingLine1: string
    headingLine2: string
    /** Optional: the mobile frame breaks this heading mid-sentence instead of between them. */
    headingLinesMobile?: [string, string]
    description: string
    slides: [{ caption: string }, { caption: string }, { caption: string }]
  }
  faq: {
    heading: string
    copyLine1: string
    copyLine2: string
    cta: string
    items: [
      { question: string; answer: string },
      { question: string; answer: string },
      { question: string; answer: string },
      { question: string; answer: string },
      { question: string; answer: string },
      { question: string; answer: string },
    ]
  }
  ctaFooter: {
    headingLines: [string, string, string]
    /** Optional: the mobile frame breaks after the first word and lets the rest wrap. */
    headingLinesMobile?: [string, string]
    description: string
    applyAsBrand: string
    applyAsCreator: string
    copyright: string
  }
}
