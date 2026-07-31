import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders as render } from '../../../tests/renderWithProviders'
import NavMenu from './NavMenu'

test('the single toggle opens and closes the panel', () => {
  render(<NavMenu />)
  const toggle = screen.getByRole('button', { name: /menu/i })
  const panel = screen.getByTestId('nav-menu')

  expect(panel).toHaveAttribute('data-open', 'false')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')

  fireEvent.click(toggle)
  expect(panel).toHaveAttribute('data-open', 'true')
  expect(toggle).toHaveAttribute('aria-expanded', 'true')

  fireEvent.click(toggle)
  expect(panel).toHaveAttribute('data-open', 'false')
})

test('renders the sitemap, legal and social groups once open', () => {
  render(<NavMenu />)
  // Shut, the panel is hidden from assistive tech, so its contents are deliberately absent
  // from the accessibility tree — open it before asking for them by role.
  fireEvent.click(screen.getByRole('button', { name: /menu/i }))

  for (const label of ['How It Works', 'For Brands', 'For Creators', 'FAQ']) {
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
  }
  for (const label of ['Privacy Policy', 'Terms of Service']) {
    expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
  }
  expect(screen.queryByText('Cookie Policy')).not.toBeInTheDocument()
  for (const label of ['Instagram', 'LinkedIn', 'X', 'Telegram']) {
    expect(screen.getByAltText(label)).toBeInTheDocument()
  }
})

test('a sitemap link scrolls to its section and closes the panel', () => {
  const section = document.createElement('div')
  section.setAttribute('data-testid', 'for-brands')
  section.scrollIntoView = vi.fn()
  document.body.appendChild(section)

  render(<NavMenu />)
  fireEvent.click(screen.getByRole('button', { name: /menu/i }))
  fireEvent.click(screen.getByRole('button', { name: 'For Brands' }))

  expect(section.scrollIntoView).toHaveBeenCalled()
  expect(screen.getByTestId('nav-menu')).toHaveAttribute('data-open', 'false')
  section.remove()
})

test('the panel closes on Escape', () => {
  render(<NavMenu />)
  fireEvent.click(screen.getByRole('button', { name: /menu/i }))
  expect(screen.getByTestId('nav-menu')).toHaveAttribute('data-open', 'true')

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.getByTestId('nav-menu')).toHaveAttribute('data-open', 'false')
})
