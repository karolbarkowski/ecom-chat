import { Suspense } from 'react'
import { TagsCloudClient } from './TagsCloud.client'
import config from '@payload-config'
import { getPayload } from 'payload'

export const TagsCloud = async () => {
  const payload = await getPayload({ config })
  const tags = (await payload.db.collections['posts']?.distinct('tags.tag')) as string[]

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <TagsCloudClient tags={tags} />
    </Suspense>
  )
}
