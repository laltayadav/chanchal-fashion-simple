export const SITE_NAME = 'Chanchal Fashion'
export const SITE_ORIGIN = 'https://chanchalfashion.com'

export function getSiteStructuredData() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
  ]
}
