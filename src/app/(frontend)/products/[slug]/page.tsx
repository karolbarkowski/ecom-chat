import { notFound } from 'next/navigation'
import { Product } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ProductImageGallery } from '../_components/ProductImageGallery'
import { RatingStars } from '../_components/RatingStars'

export const dynamic = 'force-dynamic'

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const payload = await getPayload({ config })
  const product = await payload
    .find({
      collection: 'products',
      where: { slug: { equals: slug } },
    })
    .then((res) => res.docs[0] as Product | undefined)

  if (!product) {
    notFound()
  }

  // Calculate discount savings
  const savings = product.pricePrevious
    ? Math.round((product.pricePrevious - product.price) * 100) / 100
    : 0

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 container mx-auto py-16">
      {/* Image Gallery Section */}
      <ProductImageGallery
        images={product.mediaImages || []}
        productTitle={product.title}
        discountPercentage={savings}
      />

      {/* Product Information Section */}
      <div className="space-y-6">
        {/* Product Title and Brand */}
        <div>
          <h1 className="text-3xl tracking-wide mb-3">{product.title}</h1>
          <p className="text-lg">by {product.manufacturer}</p>
        </div>

        {/* Reviews */}
        <RatingStars rating={4} count={product.reviews?.totalDocs || 0} />

        {/* Price Section */}
        <div className="flex items-center space-x-4 mb-4">
          <p className="text-2xl text-savoy-accent-orange">${product.price}</p>
          {savings > 0 ? (
            <>
              <span className="text-xl opacity-50 line-through">${product.pricePrevious}</span>
              <span className=" bg-savoy-accent-orange  text-white px-3 py-1 rounded-full text-sm">
                Save ${savings.toFixed(2)}
              </span>
            </>
          ) : null}
        </div>

        {/* Product Description */}
        <p className="leading-relaxed">{product.description}</p>

        {/* Details table */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Color</span>
              <span>{product.color}</span>
            </div>
            <div className="flex justify-between">
              <span>Category</span>
              <span>{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Manufacturer</span>
              <span>{product.manufacturer}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
