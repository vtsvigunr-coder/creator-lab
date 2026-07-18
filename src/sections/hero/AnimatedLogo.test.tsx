import { render, screen } from '@testing-library/react'
import AnimatedLogo from './AnimatedLogo'

test('renders the logo mark and ten letter paths', () => {
  render(<AnimatedLogo />)
  const logo = screen.getByTestId('animated-logo')
  expect(logo.querySelectorAll('path').length).toBe(12)
})
