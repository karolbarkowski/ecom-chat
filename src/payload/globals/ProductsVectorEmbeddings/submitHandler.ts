'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers'
import { Product } from '@/payload-types'
import { cosineSimilarity } from '@/services/ai-vectors'

async function generateEmbedding(embedder: FeatureExtractionPipeline, text: string): Promise {
  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  })
  return Array.from(output.data)
}

function productToEmbeddingText(product: Product): string {
  const parts = [
    product.title,
    product.description,
    product.category,
    product.manufacturer,
    product.color,
  ].filter(Boolean) // Remove undefined values

  return parts.join(' ')
}

export async function submitData() {
  const payload = await getPayload({ config })
  const products = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1000,
  })

  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

  for (const product of products.docs) {
    const dataToEmbed = productToEmbeddingText(product)
    console.log(dataToEmbed)
    const embedding = await generateEmbedding(embedder, dataToEmbed)

    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        embedding: embedding,
      },
    })
  }
}

// export async function testing() {
//   // Test similarity
//   const product1 =
//     'Trampki damskie CONVERSE Chuck Taylor All Star II Craft Leather 555958C Trampki damskie CONVERSE Chuck Taylor All Star II Craft Leather 555958C to trampki idealnie nadające się do użytku codziennego. Dobrze dobrany materiał i doskonałe wykonanie, zapewniają najwyższą trwałość obuwia. Wygodę zapewnia perfekcyjne dopasowanie do stopy. Trampki damskie CONVERSE Chuck Taylor All Star II Craft Leather 555958C są stworzone z dobrej jakości materiału, który nadaje im lekkości oraz modnego charakteru. Od bardzo dawna trampki uważane są za obuwie uniwersalne. To modne obuwie doskonale sprawdza się w stylizacji sportowej, jak i na wyprawie w miasto. Trampki damskie CONVERSE Chuck Taylor All Star II Craft Leather 555958C zapewnią nam komfort oraz sprawią, że stopy zyskają lekkość i wygodę, jakiej inne buty nie potrafią nam dać. Odzież, obuwie, dodatki converse czarny'
//   const product2 =
//     'Buty damskie COLUMBIA Palermo Street Tall BL0042012 Buty damskie COLUMBIA Palermo Street Tall BL0042012 to buty lifestylowe z ociepleniem. Przeznaczone do użytku codziennego, powodują, iż każdy spacer i wypad na miasto w zimne dni będzie przyjemniejszy. Buty damskie COLUMBIA Palermo Street Tall BL0042012 są doskonale wykonane, dzięki czemu również trwałe, co przy butach tego typu jest bardzo istotne. Poza trwałością charakteryzuje je również wygoda i lekkość. Dodatkowe ocieplenie zapewnia komfort podczas chłodniejszych dni, a modny wygląd powoduje, że będą uzupełniać każdą stylizację. Buty damskie COLUMBIA Palermo Street Tall BL0042012 doskonale sprawdzą się w okresie niskich temperatur. Odzież, obuwie, dodatki columbia czarny'
//   const query = 'damskie buty columbia'
//   const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

//   const embedding1 = await generateEmbedding(embedder, product1)
//   const embedding2 = await generateEmbedding(embedder, product2)
//   const queryEmbedding = await generateEmbedding(embedder, query)

//   console.log('EMBED START:')

//   console.log(queryEmbedding.join(','))
//   console.log('EMBED END')
// }
