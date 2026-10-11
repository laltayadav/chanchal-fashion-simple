import type { Metadata } from 'next'
import AppShell from '../components/AppShell'
import { HomepageHero } from '../components/HomepageHero'
import { getConfig } from '../lib/db'
import { getHomepageContent } from '../lib/homepage-content'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = getHomepageContent(await getConfig())

  return {
    title: { absolute: `${content.title} | Chanchal Fashion` },
    description: content.description,
    alternates: { canonical: '/' },
    openGraph: {
      title: `${content.title} | Chanchal Fashion`,
      description: content.description,
      url: '/',
      type: 'website',
    },
  }
}

export default async function HomePage() {
  const content = getHomepageContent(await getConfig())

  return (
    <AppShell>
      <HomepageHero title={content.title} description={content.description} slides={content.resolvedSlides} />
    </AppShell>
  )
}
