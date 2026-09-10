import SellerPortalPage, { generateMetadata as portalMetadata } from '../[slug]/page'

const params = Promise.resolve({ slug: '1709-crested-butte-dr' })

export async function generateMetadata() {
  return portalMetadata({ params })
}

export default async function CrestedButtePortalPage() {
  return SellerPortalPage({ params })
}
