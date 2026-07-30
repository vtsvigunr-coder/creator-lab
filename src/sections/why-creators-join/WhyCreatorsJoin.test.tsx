import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../tests/renderWithProviders'
import WhyCreatorsJoin from './WhyCreatorsJoin'
import { JOIN_SLIDES } from './slides'
import { en } from '../../i18n/translations/en'

describe('WhyCreatorsJoin', () => {
  it('renders the heading, description, and all three slide captions', () => {
    renderWithProviders(<WhyCreatorsJoin />)

    const root = screen.getByTestId('why-creators-join')
    expect(root).toHaveTextContent('Not for everyone.For serious players.')
    expect(root).toHaveTextContent('Creator Lab is built for brands that want real sales')

    for (const slide of en.whyCreatorsJoin.slides) {
      expect(root).toHaveTextContent(slide.caption)
    }
  })

  it('renders exactly one media layer per slide, each with its image and two icons', () => {
    renderWithProviders(<WhyCreatorsJoin />)

    const layers = Array.from(
      screen.getByTestId('why-creators-join').querySelectorAll('[data-join-layer]'),
    )
    expect(layers).toHaveLength(JOIN_SLIDES.length)

    layers.forEach((layer, i) => {
      expect(layer).toHaveAttribute('data-join-id', JOIN_SLIDES[i].id)
      expect(layer.querySelectorAll('[data-join-icon]')).toHaveLength(2)
    })
  })

  it('renders one caption per slide, each split into soft-blur-char units', () => {
    renderWithProviders(<WhyCreatorsJoin />)

    const captions = Array.from(
      screen.getByTestId('why-creators-join').querySelectorAll('[data-join-caption]'),
    )
    expect(captions).toHaveLength(JOIN_SLIDES.length)

    captions.forEach((caption, i) => {
      expect(caption).toHaveAttribute('data-join-id', JOIN_SLIDES[i].id)
      expect(caption.querySelectorAll('[data-soft-blur-char]').length).toBeGreaterThan(0)
    })
  })
})
