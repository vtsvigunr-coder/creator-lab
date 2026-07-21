import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CtaFooter from './CtaFooter'

describe('CtaFooter', () => {
  it('renders the heading, description, and both CTA buttons', () => {
    render(<CtaFooter />)

    const root = screen.getByTestId('cta-footer')
    expect(root).toHaveTextContent('Join the nextlayer of commercein Uzbekistan')
    expect(root).toHaveTextContent(
      'Whether you are a brand looking for scalable distribution or a creator looking for structured monetization, Creator Lab is where the system works.',
    )
    expect(screen.getByText('Apply as a Brand')).toBeInTheDocument()
    expect(screen.getByText('Apply as a Creator')).toBeInTheDocument()
  })

  it('starts the footer panel below the viewport, arched edge already shaped', () => {
    render(<CtaFooter />)

    const rise = screen.getByTestId('cta-rise')
    // A fixed arch, not a morphing curtain: the shape is set once and only the panel moves.
    // Values below are the arch for the 1200x800 rect the test environment's
    // getBoundingClientRect polyfill hands out (see tests/setupTests.ts) — a real shape, not
    // just the presence of a `path(...)` call.
    expect(rise.style.clipPath).toContain("M 0 120 L 440 32 Q 600 0 760 32 L 1200 120")
    expect(rise.style.transform).toContain('translate3d')
  })

  it('holds the photo still by giving it the inverse of the panel travel', () => {
    render(<CtaFooter />)

    const rise = screen.getByTestId('cta-rise')
    const photo = screen.getByTestId('cta-photo')
    const travel = (s: string) => Number(s.match(/translate3d\(0(?:px)?, (-?[\d.]+)px/)?.[1])

    expect(travel(photo.style.transform)).toBe(-travel(rise.style.transform))
  })

  it('renders the legal links below the footer bar', () => {
    render(<CtaFooter />)

    for (const label of ['Privacy Policy', 'Terms of Service', 'Cookie Policy']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('renders the footer bar with copyright, every nav link, and the social icons', () => {
    render(<CtaFooter />)

    expect(screen.getByText('© 2026 Creator Lab. All rights reserved.')).toBeInTheDocument()
    for (const label of ['How It Works', 'For Brands', 'For Creators', 'Pricing', 'FAQ']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
    for (const label of ['Instagram', 'LinkedIn', 'X', 'Telegram']) {
      expect(screen.getByAltText(label)).toBeInTheDocument()
    }
  })

  it('scrolls the matching section into view when a nav link with a target is clicked', () => {
    document.body.innerHTML = ''
    render(<CtaFooter />)

    const target = document.createElement('div')
    target.setAttribute('data-testid', 'faq')
    document.body.appendChild(target)
    const scrollIntoView = vi.fn()
    target.scrollIntoView = scrollIntoView

    fireEvent.click(screen.getByRole('button', { name: 'FAQ' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('does nothing when the Pricing link (no section yet) is clicked', () => {
    render(<CtaFooter />)
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Pricing' }))).not.toThrow()
  })
})
