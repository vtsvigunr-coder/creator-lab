import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders as render } from '../../../tests/renderWithProviders'
import WhyNow from './WhyNow'

describe('WhyNow', () => {
  it('renders the heading, subtitle, and all four bento cards', () => {
    render(<WhyNow />)

    expect(screen.getByTestId('why-now')).toHaveTextContent(
      'Built forthe realityof Uzbekistan',
    )
    expect(screen.getByTestId('why-now')).toHaveTextContent(
      'Creator Lab is designed for the local market',
    )

    expect(screen.getByText('Social-first product discovery')).toBeInTheDocument()
    expect(screen.getByText('DM-based selling habits')).toBeInTheDocument()
    expect(screen.getByText('Fragmented creator-brand relationships')).toBeInTheDocument()
    expect(screen.getByText('Weak tracking and informal reporting')).toBeInTheDocument()
    expect(screen.getByText('Demand for better commerce systems')).toBeInTheDocument()
  })

  it('places the heading photo between the two runs of the first line, so one stagger sweeps left to right through it', () => {
    render(<WhyNow />)

    const units = Array.from(
      screen.getByTestId('why-now').querySelectorAll('[data-soft-blur-char]'),
    )
    const imgIndex = units.findIndex((el) => el.hasAttribute('data-heading-img'))
    const text = (el: Element) => el.textContent ?? ''

    expect(imgIndex).toBe(9)
    expect(units.slice(0, imgIndex).map(text).join('')).toBe('Built for')
    expect(units.slice(imgIndex + 1).map(text).join('')).toBe('the realityof Uzbekistan')
  })
})
