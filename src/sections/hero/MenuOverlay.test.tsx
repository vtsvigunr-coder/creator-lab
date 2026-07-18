import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import MenuOverlay from './MenuOverlay'

test('renders sitemap links and calls onOpen/onClose', () => {
  const onClose = vi.fn()
  const onOpen = vi.fn()
  render(<MenuOverlay open={false} onClose={onClose} onOpen={onOpen} />)

  expect(screen.getByText('How It Works')).toBeInTheDocument()
  expect(screen.getByText('For Brands')).toBeInTheDocument()
  expect(screen.getByText('For Creators')).toBeInTheDocument()
  expect(screen.getByText('Pricing')).toBeInTheDocument()
  expect(screen.getByText('FAQ')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: /menu/i }))
  expect(onOpen).toHaveBeenCalledTimes(1)

  fireEvent.click(screen.getByText('Close'))
  expect(onClose).toHaveBeenCalledTimes(1)
})
