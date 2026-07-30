import { screen } from '@testing-library/react'
import { renderWithProviders } from '../tests/renderWithProviders'
import App from './App'

test('renders the app root with the hero section', () => {
  renderWithProviders(<App />)
  expect(screen.getByTestId('app-root')).toBeInTheDocument()
  expect(screen.getByTestId('hero')).toBeInTheDocument()
})
