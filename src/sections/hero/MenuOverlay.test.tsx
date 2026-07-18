import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import MenuOverlay from './MenuOverlay'

test('renders sitemap links and toggles via the single button', () => {
  const onClose = vi.fn()
  const onOpen = vi.fn()
  const { rerender } = render(<MenuOverlay open={false} onClose={onClose} onOpen={onOpen} />)

  expect(screen.getByText('How It Works')).toBeInTheDocument()
  expect(screen.getByText('For Brands')).toBeInTheDocument()
  expect(screen.getByText('For Creators')).toBeInTheDocument()
  expect(screen.getByText('Pricing')).toBeInTheDocument()
  expect(screen.getByText('FAQ')).toBeInTheDocument()

  const toggle = screen.getByRole('button')
  fireEvent.click(toggle)
  expect(onOpen).toHaveBeenCalledTimes(1)

  rerender(<MenuOverlay open onClose={onClose} onOpen={onOpen} />)
  fireEvent.click(screen.getByRole('button'))
  expect(onClose).toHaveBeenCalledTimes(1)
})
