import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders as render } from '../../../tests/renderWithProviders'
import HowItWorks from './HowItWorks'
import { en } from '../../i18n/translations/en'

describe('HowItWorks', () => {
  it('renders the heading and all four step cards', () => {
    render(<HowItWorks />)

    expect(screen.getByTestId('how-it-works')).toHaveTextContent(
      'Simple onthe outside.Powerful underneath.',
    )
    for (const step of en.howItWorks.steps) {
      expect(screen.getByText(step.description)).toBeInTheDocument()
      expect(screen.getByText(step.badge)).toBeInTheDocument()
    }
  })

  it('places the heading icon between the two runs of the first line, so one stagger sweeps left to right through it', () => {
    render(<HowItWorks />)

    const units = Array.from(
      screen.getByTestId('how-it-works').querySelectorAll('[data-soft-blur-char]'),
    )
    const iconIndex = units.findIndex((el) => el.hasAttribute('data-heading-icon'))
    const text = (el: Element) => el.textContent ?? ''

    // "Simple on" is 9 characters, so the icon is the tenth unit — everything before it is
    // the first run and everything after belongs to the rest of the heading.
    expect(iconIndex).toBe(9)
    expect(units.slice(0, iconIndex).map(text).join('')).toBe('Simple on')
    expect(units.slice(iconIndex + 1).map(text).join('')).toBe(
      'the outside.Powerful underneath.',
    )
  })
})
