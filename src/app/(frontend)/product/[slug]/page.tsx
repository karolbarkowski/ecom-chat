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

  return (
    <section>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </section>
  )
}
