import { render, screen } from '@testing-library/react'
import CircleRevealButton from './CircleRevealButton'

test('renders the label', () => {
  render(<CircleRevealButton label="Get Started" variant="dark" />)
  expect(screen.getByText('Get Started')).toBeInTheDocument()
})
