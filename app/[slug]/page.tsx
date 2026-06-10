import type { Metadata } from 'next'

import { ProtectedContent } from '../components/protected_content'
import { SellerPortalDashboard } from './seller_portal_dashboard'

interface PageProps {
  params: Promise<{ slug: string }>
}

function getStreetNumberFromSlug(slug: string): string {
  const match = slug.match(/^(\d{1,6})(?:-|$)/)
  return match?.[1] ?? ''
}

function formatAddressFromSlug(slug: string): string {
  const words = slug.split('-').filter(Boolean)
  return words
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const address = formatAddressFromSlug(slug)
  return {
    title: `${address} - Seller Update | Keenan Group`,
    description: `Weekly market update and showing activity for ${address}`,
  }
}

export default async function SellerPortalPage({ params }: PageProps) {
  const { slug } = await params

  const streetNumber = getStreetNumberFromSlug(slug)
  const propertyAddress = formatAddressFromSlug(slug)

  if (!streetNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card-static max-w-md w-full">
          <h1 className="text-xl font-display text-honed-stone mb-2">Invalid portal link</h1>
          <p className="text-sm text-sandstone">{propertyAddress}</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedContent streetNumber={streetNumber} propertyAddress={propertyAddress} storageKey={slug}>
      <SellerPortalDashboard slug={slug} streetNumber={streetNumber} />
    </ProtectedContent>
  )
}
