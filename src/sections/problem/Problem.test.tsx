import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Problem from './Problem'

describe('Problem', () => {
  it('renders both copy stages and the curtain', () => {
    render(<Problem />)

    expect(screen.getByTestId('problem-tag')).toHaveTextContent('Problem')
    expect(screen.getByTestId('problem')).toHaveTextContent('Social commerceis already here')
    expect(screen.getByTestId('problem-curtain')).toBeInTheDocument()
    expect(screen.getByTestId('fragmented-plate')).toHaveTextContent('fragmented.')
  })
})
