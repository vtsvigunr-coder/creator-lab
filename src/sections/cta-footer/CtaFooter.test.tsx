import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders as render } from '../../../tests/renderWithProviders'
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

  it('renders the photo as a plain, unshaped, unanimated layer', () => {
    render(<CtaFooter />)

    const photo = screen.getByTestId('cta-photo')
    expect(photo.style.clipPath).toBe('')
    expect(photo.style.transform).toBe('')
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
    for (const label of ['How It Works', 'For Brands', 'For Creators', 'FAQ']) {
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
})
