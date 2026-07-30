import { screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders as render } from '../../../tests/renderWithProviders'
import SolutionSlider from './SolutionSlider'
import { SLIDES } from './slides'
import { en } from '../../i18n/translations/en'

const labels = () => screen.getByTestId('solution-slider').textContent ?? ''

describe('SolutionSlider', () => {
  it('shows the neighbouring slides in the side circles', () => {
    render(<SolutionSlider />)
    // Centre is SLIDES[0]; the sides are its neighbours, and the caption belongs to the centre.
    expect(labels()).toContain(en.solution.slides[2].label)
    expect(labels()).toContain(en.solution.slides[1].label)
    expect(labels()).toContain(en.solution.slides[0].caption)
  })

  it('advances to the next slide and rotates the sides with it', () => {
    render(<SolutionSlider />)
    fireEvent.click(screen.getByLabelText('Next'))

    expect(labels()).toContain(en.solution.slides[1].caption)
    expect(labels()).toContain(en.solution.slides[0].label)
    expect(labels()).toContain(en.solution.slides[2].label)
  })

  it('wraps around when stepping back from the first slide', () => {
    render(<SolutionSlider />)
    fireEvent.click(screen.getByLabelText('Previous'))

    expect(labels()).toContain(en.solution.slides[SLIDES.length - 1].caption)
  })
})
