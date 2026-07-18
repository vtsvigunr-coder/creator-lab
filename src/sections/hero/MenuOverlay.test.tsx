import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import MenuOverlay from './MenuOverlay'

test('shows sitemap links only when open, and calls onClose', () => {
  const onClose = vi.fn()
  const onOpen = vi.fn()
  const { rerender } = render(<MenuOverlay open={false} onClose={onClose} onOpen={onOpen} />)
  expect(screen.queryByText('How It Works')).not.toBeInTheDocument()

  rerender(<MenuOverlay open onClose={onClose} onOpen={onOpen} />)
  expect(screen.getByText('How It Works')).toBeInTheDocument()
  expect(screen.getByText('For Brands')).toBeInTheDocument()
  expect(screen.getByText('For Creators')).toBeInTheDocument()
  expect(screen.getByText('Pricing')).toBeInTheDocument()
  expect(screen.getByText('FAQ')).toBeInTheDocument()

  fireEvent.click(screen.getByText('Close'))
  expect(onClose).toHaveBeenCalledTimes(1)
})
