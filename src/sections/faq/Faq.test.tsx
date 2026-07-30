import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../tests/renderWithProviders'
import Faq from './Faq'
import { en } from '../../i18n/translations/en'

describe('Faq', () => {
  it('renders the heading and every question', () => {
    renderWithProviders(<Faq />)

    expect(screen.getByTestId('faq')).toHaveTextContent('Frequently Asked Questions')
    for (const item of en.faq.items) {
      expect(screen.getByText(item.question)).toBeInTheDocument()
    }
  })

  it('opens the first question by default, not the second', () => {
    renderWithProviders(<Faq />)

    const buttons = screen.getAllByRole('button', { name: /.+\?/ })
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText(en.faq.items[0].answer)).toBeInTheDocument()
  })

  it('toggles a question open and closed on click', () => {
    renderWithProviders(<Faq />)

    const buttons = screen.getAllByRole('button', { name: /.+\?/ })
    const first = buttons[0]
    const third = buttons[2]

    expect(first).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'false')

    expect(third).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(third)
    expect(third).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(en.faq.items[2].answer)).toBeInTheDocument()
  })
})
