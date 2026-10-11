import type { Config, HomepageSlide } from './types'

export const DEFAULT_HOMEPAGE_TITLE = 'Weave Your Own Story'
export const DEFAULT_HOMEPAGE_DESCRIPTION = 'Discover elegant sarees, statement blouses, and festive sets for every celebration.'
export const MAX_HOMEPAGE_TITLE_LENGTH = 90
export const MAX_HOMEPAGE_DESCRIPTION_LENGTH = 220
export const MAX_HOMEPAGE_IMAGES = 5

export function normalizeHomepageText(value: unknown, fallback: string, maxLength: number) {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().slice(0, maxLength)
  return normalized || fallback
}

export function isValidHomepageImagePath(value: unknown): value is string {
  return typeof value === 'string' && /^uploads\/[A-Za-z0-9_-]+\.(?:webp|jpe?g|png)$/i.test(value)
}

export function getHomepageContent(config: Pick<Config, 'homepageTitle' | 'homepageDescription' | 'homepageImage' | 'homepageImages' | 'homepageSlides'>) {
  const title = normalizeHomepageText(config.homepageTitle, DEFAULT_HOMEPAGE_TITLE, MAX_HOMEPAGE_TITLE_LENGTH)
  const description = normalizeHomepageText(config.homepageDescription, DEFAULT_HOMEPAGE_DESCRIPTION, MAX_HOMEPAGE_DESCRIPTION_LENGTH)
  const configuredSlides: unknown[] = Array.isArray(config.homepageSlides)
    ? config.homepageSlides
    : (Array.isArray(config.homepageImages) ? config.homepageImages : [config.homepageImage]).map((image) => ({ image }))
  const slides: HomepageSlide[] = configuredSlides
    .filter((slide): slide is HomepageSlide => (
      typeof slide === 'object' &&
      slide !== null &&
      'image' in slide &&
      isValidHomepageImagePath(slide.image)
    ))
    .slice(0, MAX_HOMEPAGE_IMAGES)
    .map((slide) => ({
      image: slide.image,
      title: typeof slide.title === 'string' ? slide.title.trim().slice(0, MAX_HOMEPAGE_TITLE_LENGTH) : '',
      description: typeof slide.description === 'string' ? slide.description.trim().slice(0, MAX_HOMEPAGE_DESCRIPTION_LENGTH) : '',
    }))

  return {
    title,
    description,
    image: slides[0]?.image || '',
    images: slides.map((slide) => slide.image),
    slides,
    resolvedSlides: slides.map((slide, index) => ({
      ...slide,
      title: index === 0 ? title : slide.title || title,
      description: index === 0 ? description : slide.description || description,
    })),
  }
}
