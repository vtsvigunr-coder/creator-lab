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
      { title: [string, string]; description: string; badge: string },
      { title: [string, string]; description: string; badge: string },
      { title: [string, string]; description: string; badge: string },
      { title: [string, string]; description: string; badge: string },
    ]
  }
  forBrands: {
    tag: string
    headingLine1: string
    headingLine2: string
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
    description: string
    applyAsBrand: string
    applyAsCreator: string
    copyright: string
  }
}
