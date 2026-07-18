import { render, screen } from '@testing-library/react'
import CircleRevealButton from './CircleRevealButton'

test('renders label and calls onReady with a play function', () => {
  let playFn: (() => Promise<void>) | undefined
  render(
    <CircleRevealButton
      label="Get Started"
      variant="dark"
      onReady={(play) => {
        playFn = play
      }}
    />,
  )
  expect(screen.getByText('Get Started')).toBeInTheDocument()
  expect(typeof playFn).toBe('function')
})
