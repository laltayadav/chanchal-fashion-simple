import { describe, expect, it } from 'vitest'
import robots from '../app/robots'
import sitemap from '../app/sitemap'
import { getSiteStructuredData } from '../lib/site-identity'

describe('SEO baseline', () => {
  it('allows public storefront routes and disallows admin, API, and cart paths', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/cart'],
      },
      sitemap: 'https://chanchalfashion.com/sitemap.xml',
      host: 'https://chanchalfashion.com',
    })
  })

  it('lists only canonical, indexable public routes', () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      'https://chanchalfashion.com/',
      'https://chanchalfashion.com/shop',
    ])
  })

  it('provides only verified organization and website identity without product or rating claims', () => {
    const schemas = getSiteStructuredData()
    expect(schemas).toEqual([
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Chanchal Fashion',
        url: 'https://chanchalfashion.com',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Chanchal Fashion',
        url: 'https://chanchalfashion.com',
      },
    ])
    expect(JSON.stringify(schemas)).not.toMatch(/Product|Offer|AggregateRating|Review/)
  })
})
