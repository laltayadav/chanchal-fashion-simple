import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '../lib/site-identity'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_ORIGIN}/`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_ORIGIN}/shop`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
