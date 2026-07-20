import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Faq from './Faq'
import { FAQ_ITEMS } from './faqItems'

describe('Faq', () => {
  it('renders the heading and every question', () => {
    render(<Faq />)

    expect(screen.getByTestId('faq')).toHaveTextContent('Frequently Asked Questions')
    for (const item of FAQ_ITEMS) {
      expect(screen.getByText(item.question)).toBeInTheDocument()
    }
  })

  it('opens the first question by default, not the second', () => {
    render(<Faq />)

    const buttons = screen.getAllByRole('button', { name: /.+\?/ })
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText(FAQ_ITEMS[0].answer)).toBeInTheDocument()
  })

  it('toggles a question open and closed on click', () => {
    render(<Faq />)

    const buttons = screen.getAllByRole('button', { name: /.+\?/ })
    const first = buttons[0]
    const third = buttons[2]

    expect(first).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'false')

    expect(third).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(third)
    expect(third).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(FAQ_ITEMS[2].answer)).toBeInTheDocument()
  })
})
