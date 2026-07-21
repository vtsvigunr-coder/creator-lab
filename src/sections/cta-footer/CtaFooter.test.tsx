import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CtaFooter from './CtaFooter'

describe('CtaFooter', () => {
  it('renders the heading, description, and both CTA buttons', () => {
    render(<CtaFooter />)

    const root = screen.getByTestId('cta-footer')
    expect(root).toHaveTextContent('Join the nextlayer of commercein Uzbekistan')
    expect(root).toHaveTextContent('Whether you are a brand looking for scalable distribution')
    expect(screen.getByText('Apply as a Brand')).toBeInTheDocument()
    expect(screen.getByText('Apply as a Creator')).toBeInTheDocument()
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
