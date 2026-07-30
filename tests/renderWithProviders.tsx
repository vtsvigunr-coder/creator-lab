import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { LanguageProvider } from '../src/i18n/LanguageContext'

/** Every component that reads translations needs a LanguageProvider above it. */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(<LanguageProvider>{ui}</LanguageProvider>, options)
}
