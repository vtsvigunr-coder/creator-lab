import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders as render } from '../../tests/renderWithProviders'
import { en } from './translations/en'
import { ru } from './translations/ru'
import { langFromPathname } from './LanguageContext'
import NavMenu from '../sections/hero/NavMenu'
import Hero from '../sections/hero/Hero'

// A missing key is already a type error (both dictionaries implement `Translations`), so what
// is worth asserting is the thing the type cannot see: that no Russian value was left as its
// English original.
test('every Russian string differs from its English counterpart', () => {
  const flatten = (value: unknown, path: string[] = []): [string, string][] =>
    typeof value === 'string'
      ? [[path.join('.'), value]]
      : Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => flatten(v, [...path, k]))

  const enStrings = new Map(flatten(en))
  const untranslated = flatten(ru)
    .filter(([key, value]) => enStrings.get(key) === value)
    // Both of these are correct as-is, not missed keys: `FAQ` is the same acronym in Russian,
    // and the brand name is never translated.
    .filter(([key]) => key !== 'nav.sitemap.faq' && key !== 'howItWorks.steps.3.title.0')

  expect(untranslated).toEqual([])
})

test('the route decides the language', () => {
  expect(langFromPathname('/')).toBe('en')
  expect(langFromPathname('/ru')).toBe('ru')
  expect(langFromPathname('/ru/')).toBe('ru')
  expect(langFromPathname('/anything-else')).toBe('en')
})

test('/ru renders the Russian copy', () => {
  // The hero splits its headline into per-character spans for the entrance animation, so the
  // words only exist as whole strings in the subtree's textContent.
  const { container } = render(<Hero />, { route: '/ru' })
  expect(container.textContent).toContain(ru.hero.markerWord)
  expect(container.textContent).not.toContain(en.hero.markerWord)
})

test('the menu offers both languages, marking the active one', () => {
  render(<NavMenu />, { route: '/ru' })
  fireEvent.click(screen.getByRole('button', { name: new RegExp(ru.nav.menuLabel, 'i') }))

  expect(screen.getByRole('button', { name: 'RU' })).toHaveAttribute('aria-current', 'true')
  expect(screen.getByRole('button', { name: 'EN' })).not.toHaveAttribute('aria-current')
})
