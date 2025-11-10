import { performHybridSearch } from '@/workflows/hybrid-search'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  var result = await performHybridSearch('looking for a cheap, christmas home decor below $20', {
    numCandidates: 5,
  })

  return Response.json(result)
}
