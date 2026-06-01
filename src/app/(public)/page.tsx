import { getProducts } from '@/lib/actions/products'
import { getHomepageSections, getCollections } from '@/lib/actions/cms'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CollectionsGrid from '@/components/home/CollectionsGrid'
import BrandStory from '@/components/home/BrandStory'
import NewsletterSection from '@/components/home/NewsletterSection'
import { Collection, HomepageSection, Product } from '@/types/database'

export default async function HomePage() {
  const [{ produits }, sections, collections] = await Promise.all([
    getProducts({ featured: true, limit: 8 }) as Promise<{ produits: Product[] }>,
    getHomepageSections() as Promise<HomepageSection[]>,
    getCollections() as Promise<Collection[]>,
  ])

  const heroSection = sections.find(s => s.cle === 'hero')
  const featuredTitle = sections.find(s => s.cle === 'featured_title')
  const brandStory = sections.find(s => s.cle === 'brand_story')
  const collectionsTitle = sections.find(s => s.cle === 'collections_title')
  const newsletterSection = sections.find(s => s.cle === 'newsletter_title')

  return (
    <div>
      {heroSection && <HeroSection section={heroSection} />}
      {featuredTitle && <FeaturedProducts produits={produits} section={featuredTitle} />}
      {collectionsTitle && <CollectionsGrid collections={collections} section={collectionsTitle} />}
      {brandStory && <BrandStory section={brandStory} />}
      {newsletterSection && <NewsletterSection section={newsletterSection} />}
    </div>
  )
}