import { notFound } from 'next/navigation'
import { Product } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ProductImageGallery } from '@/app/components/ProductImageGallery'

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
            <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
              {product.title}
            </h1>
            <p className="text-lg text-slate-400">by {product.manufacturer}</p>
          </div>

          {/* Reviews */}
          <div className="flex items-center">
            <div className="flex text-amber-400">
              <span>★★★★★</span>
            </div>
            <span className="ml-2 text-sm text-slate-400">(4 reviews)</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-3xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ${product.price}
            </span>
            {savings > 0 ? (
              <>
                <span className="text-xl text-slate-500 line-through">
                  ${product.pricePrevious}
                </span>
                <span className="bg-linear-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save ${savings.toFixed(2)}
                </span>
              </>
            ) : null}
          </div>

          {/* Product Description */}
          <div className="prose prose-invert">
            <p className="text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Details table */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Product Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Color</span>
                <span className="font-medium text-slate-100">{product.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="font-medium text-slate-100">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Manufacturer</span>
                <span className="font-medium text-slate-100">{product.manufacturer}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
