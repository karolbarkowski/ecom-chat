/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation'
import { Product } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

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
  const savings = product.pricePrevious ? product.pricePrevious - product.price : 0

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery Section */}
        <div className="space-y-6">
          {/* Main Image Display */}
          <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
            <img
              id="mainImage"
              src={product?.mediaImages?.[0]?.url}
              alt={product.title}
              className="w-full h-96 lg:h-[500px] object-cover transition-opacity duration-300"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                - {savings}%
              </span>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {product?.mediaImages?.map((image, index) => (
              <button
                key={index}
                className={`thumbnail-btn flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === 0
                    ? 'border-2 border-purple-500 opacity-100 scale-105'
                    : 'border-2 border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="space-y-6">
          {/* Product Title and Brand */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
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
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ${product.price}
            </span>
            <span className="text-xl text-slate-500 line-through">${product.pricePrevious}</span>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Save ${savings.toFixed(2)}
            </span>
          </div>

          {/* Product Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Specifications */}
          {/* <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm text-slate-400">{key}</span>
                    <p className="font-medium text-slate-100">{value}</p>
                  </div>
                ))}
              </div>
            </div> */}

          {/* Category and Manufacturer */}
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
