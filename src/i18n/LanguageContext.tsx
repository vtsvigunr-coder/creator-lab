import { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react'
import { en } from './translations/en'
import type { Translations } from './types'

// Only English is live for now — the Russian pass didn't hold up (broke the layout, weak
// translation quality) and got pulled. This context stays in place so every section already
// reads its copy through `t.*` instead of hardcoded strings: adding a real second language
// later is a matter of restoring the dictionary and the switch, not re-threading every
// component again.
export type Lang = 'en'

type LanguageContextValue = {
  lang: Lang
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'en'
  }, [])

  const value = useMemo<LanguageContextValue>(() => ({ lang: 'en', t: en }), [])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider')
  return ctx
}
