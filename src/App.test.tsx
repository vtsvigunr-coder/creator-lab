import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the app root with the hero section', () => {
  render(<App />)
  expect(screen.getByTestId('app-root')).toBeInTheDocument()
  expect(screen.getByTestId('hero')).toBeInTheDocument()
})
