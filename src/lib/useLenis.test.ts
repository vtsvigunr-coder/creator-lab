import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useLenis } from './useLenis'

vi.mock('lenis', () => {
  return {
    default: vi.fn().mockImplementation(function MockLenis(this: unknown) {
      Object.assign(this as object, {
        raf: vi.fn(),
        on: vi.fn(),
        destroy: vi.fn(),
      })
    }),
  }
})

test('instantiates Lenis once and registers a raf ticker callback', async () => {
  const { unmount } = renderHook(() => useLenis())
  const Lenis = (await import('lenis')).default
  expect(Lenis).toHaveBeenCalledTimes(1)
  unmount()
})
