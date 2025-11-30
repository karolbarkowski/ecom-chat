import configPromise from '@payload-config'
import { getPayload } from 'payload'

const AI_API_URL = process.env.AI_API_URL || 'http://localhost:8000'

export const POST = async (request: Request) => {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return Response.json({ error: 'imageUrl is required' }, { status: 400 })
    }

    // 1. Fetch image from URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return Response.json({ error: 'Failed to fetch image from URL' }, { status: 400 })
    }

    const imageBlob = await imageResponse.blob()

    // 2. Send to AI-Api for background removal
    const formData = new FormData()
    formData.append('file', imageBlob, 'image.png')

    const aiResponse = await fetch(`${AI_API_URL}/remove-background`, {
      method: 'POST',
      body: formData,
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      return Response.json(
        { error: `Background removal failed: ${errorText}` },
        { status: 502 },
      )
    }

    const processedImageBlob = await aiResponse.blob()

    // 3. Upload to Payload Media collection
    const payload = await getPayload({ config: configPromise })

    // Extract filename from URL or generate one
    const urlPath = new URL(imageUrl).pathname
    const originalFilename = urlPath.split('/').pop() || 'image'
    // Remove extension and any existing _no_bg suffix to avoid duplication
    const filenameWithoutExt = originalFilename
      .replace(/\.[^/.]+$/, '')
      .replace(/_no_bg(-\d+)?$/, '')
    const timestamp = Date.now()
    const newFilename = `${filenameWithoutExt}_no_bg_${timestamp}.png`

    // Convert blob to buffer for Payload upload
    const arrayBuffer = await processedImageBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: `${filenameWithoutExt} with background removed`,
      },
      file: {
        data: buffer,
        mimetype: 'image/png',
        name: newFilename,
        size: buffer.length,
      },
    })

    // 4. Return the new media URL
    const mediaUrl = mediaDoc.url || `/media/${newFilename}`

    return Response.json({
      success: true,
      url: mediaUrl,
      mediaId: mediaDoc.id,
    })
  } catch (error) {
    console.error('Remove background error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
