import { describe, expect, it } from 'vitest'
import {
  DEFAULT_HOMEPAGE_DESCRIPTION,
  DEFAULT_HOMEPAGE_TITLE,
  getHomepageContent,
  isValidHomepageImagePath,
  normalizeHomepageText,
} from '../lib/homepage-content'

describe('homepage content defaults and validation', () => {
  it('uses default copy and no image for legacy config', () => {
    expect(getHomepageContent({})).toEqual({
      title: DEFAULT_HOMEPAGE_TITLE,
      description: DEFAULT_HOMEPAGE_DESCRIPTION,
      image: '',
      images: [],
      slides: [],
      resolvedSlides: [],
    })
  })

  it('uses default copy for blank values and restricts images to upload paths', () => {
    expect(getHomepageContent({
      homepageTitle: '  ',
      homepageDescription: '',
      homepageImage: '../private/config.json',
    })).toEqual({
      title: DEFAULT_HOMEPAGE_TITLE,
      description: DEFAULT_HOMEPAGE_DESCRIPTION,
      image: '',
      images: [],
      slides: [],
      resolvedSlides: [],
    })
    expect(isValidHomepageImagePath('uploads/abc-123.webp')).toBe(true)
    expect(isValidHomepageImagePath('https://example.com/image.webp')).toBe(false)
  })

  it('preserves valid configured slide order and supports legacy single-image config', () => {
    expect(getHomepageContent({
      homepageImage: 'uploads/legacy.webp',
    }).images).toEqual(['uploads/legacy.webp'])

    expect(getHomepageContent({
      homepageImages: ['uploads/second.webp', '../private/file', 'uploads/first.png'],
    }).images).toEqual(['uploads/second.webp', 'uploads/first.png'])
  })

  it('resolves slide title and description overrides independently and retains them with slide images', () => {
    const content = getHomepageContent({
      homepageTitle: 'Master title',
      homepageDescription: 'Master description',
      homepageSlides: [
        { image: 'uploads/master.webp' },
        { image: 'uploads/collection-a.webp', title: 'Sarees', description: '' },
        { image: 'uploads/collection-b.webp', title: '', description: 'Festive styles' },
      ],
    })

    expect(content.resolvedSlides).toEqual([
      { image: 'uploads/master.webp', title: 'Master title', description: 'Master description' },
      { image: 'uploads/collection-a.webp', title: 'Sarees', description: 'Master description' },
      { image: 'uploads/collection-b.webp', title: 'Master title', description: 'Festive styles' },
    ])
    const reordered = [...content.slides].reverse()
    expect(reordered.map(({ image, title, description }) => ({ image, title, description }))).toEqual([
      { image: 'uploads/collection-b.webp', title: '', description: 'Festive styles' },
      { image: 'uploads/collection-a.webp', title: 'Sarees', description: '' },
      { image: 'uploads/master.webp', title: '', description: '' },
    ])
  })

  it('trims and bounds homepage text', () => {
    expect(normalizeHomepageText('  hello  ', 'fallback', 5)).toBe('hello')
    expect(normalizeHomepageText('  longer than limit  ', 'fallback', 5)).toBe('longe')
  })
})
