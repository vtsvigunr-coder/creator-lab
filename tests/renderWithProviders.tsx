import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../src/i18n/LanguageContext'

/**
 * Every component that reads translations needs a LanguageProvider above it, and the provider
 * reads the active language off the route — so a router has to be above that. Pass `route` to
 * render a component in Russian (`/ru`); the default is the English entry point.
 */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions & { route?: string }) {
  const { route = '/', ...renderOptions } = options ?? {}
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>{ui}</LanguageProvider>
    </MemoryRouter>,
    renderOptions,
  )
}
