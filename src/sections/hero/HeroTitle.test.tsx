import { screen } from '@testing-library/react'
import { renderWithProviders as render } from '../../../tests/renderWithProviders'
import HeroTitle from './HeroTitle'

test('renders the title, highlighted word, and description', () => {
  render(<HeroTitle />)
  const title = screen.getByTestId('hero-title')
  expect(title).toHaveTextContent('The operating system')
  expect(title).toHaveTextContent('for creator-led commerce')
  expect(title).toHaveTextContent('Uzbekistan')
  expect(screen.getByTestId('uzbekistan-marker')).toBeInTheDocument()
  expect(title).toHaveTextContent(
    'Creator Lab helps brands sell through creators, and helps creators earn through trackable products, links, payouts, and performance',
  )
})
