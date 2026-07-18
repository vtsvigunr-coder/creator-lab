import { render, screen } from '@testing-library/react'
import CardMarquee from './CardMarquee'

test('renders a duplicated, seamless card track', () => {
  render(<CardMarquee />)
  const marquee = screen.getByTestId('card-marquee')
  expect(marquee.querySelectorAll('[data-card]').length).toBe(16) // 8 cards x2 for the loop
})
