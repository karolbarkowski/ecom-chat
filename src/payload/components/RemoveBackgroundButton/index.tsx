'use client'
import React, { useState } from 'react'
import { Button, useDocumentInfo } from '@payloadcms/ui'
import './index.scss'

const RemoveBackgroundButton: React.FC = () => {
  const { id } = useDocumentInfo()
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; url?: string } | null>(
    null,
  )

  const handleRemoveBackground = async () => {
    if (!id) return

    setIsProcessing(true)
    setResult(null)

    try {
      // Get the current media document URL
      const mediaResponse = await fetch(`/api/media/${id}`)
      const mediaData = await mediaResponse.json()

      if (!mediaData.url) {
        throw new Error('Could not get image URL')
      }

      // Build full URL if relative
      const imageUrl = mediaData.url.startsWith('http')
        ? mediaData.url
        : `${window.location.origin}${mediaData.url}`

      // Call remove background API
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove background')
      }

      setResult({
        success: true,
        message: 'Background removed! New image saved to Media.',
        url: `/admin/collections/media/${data.mediaId}`,
      })
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="remove-background-button">
      <Button onClick={handleRemoveBackground} disabled={isProcessing} buttonStyle="secondary">
        {isProcessing ? 'Processing...' : 'Remove Background'}
      </Button>
      {result && (
        <div className={`result-message ${result.success ? 'success' : 'error'}`}>
          {result.message}
          {result.url && (
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              View new image
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default RemoveBackgroundButton
