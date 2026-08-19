import { createContext, useCallback, useContext, useMemo, useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { en } from './translations/en'
import { ru } from './translations/ru'
import type { Translations } from './types'

// Two languages, one per route: `/` is English (the default entry point) and `/ru` is Russian.
// The active language is derived from the URL rather than kept in client state, so a Russian
// visitor can be linked straight to `/ru` and search engines see two separate pages.
export type Lang = 'en' | 'ru'

export const RU_PATH = '/ru'

const dictionaries: Record<Lang, Translations> = { en, ru }

type LanguageContextValue = {
  lang: Lang
  t: Translations
  switchLanguage: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function langFromPathname(pathname: string): Lang {
  // Tolerates the trailing slash Vercel may add, and nothing else — any other path is English.
  return pathname.replace(/\/+$/, '') === RU_PATH ? 'ru' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const lang = langFromPathname(pathname)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const switchLanguage = useCallback(
    (next: Lang) => {
      if (next === lang) return
      // The page is one long scroll-driven sequence whose triggers are measured on mount, so
      // the language swap starts from the top rather than dropping the visitor into the middle
      // of a sequence measured against the other language's text lengths.
      window.scrollTo(0, 0)
      navigate(next === 'ru' ? RU_PATH : '/')
    },
    [lang, navigate],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, t: dictionaries[lang], switchLanguage }),
    [lang, switchLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider')
  return ctx
}
