/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import { ArrayFieldClientComponent } from 'payload'
import {
  useFormFields,
  useForm,
  Button,
  FieldLabel,
  useField,
  Drawer,
  DrawerToggler,
  useModal,
} from '@payloadcms/ui'
import './index.scss'

type MediaImageFormField = {
  id?: string // Payload auto-generates IDs for array items
  url: string
  order: number
}

const DRAWER_SLUG = 'image-preview'

export const MediaImageSelectorComponent: ArrayFieldClientComponent = ({ path }) => {
  const { rows } = useField({ path, hasRows: true })
  const { removeFieldRow, setModified } = useForm()
  const { dispatch } = useFormFields(([_, dispatch]) => ({ dispatch }))
  const { closeModal } = useModal()
  const [newImageUrl, setNewImageUrl] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)

  const mediaImages = useFormFields(([fields]) => {
    if (!rows) return []

    return rows.map(
      (row, index) =>
        ({
          id: row.id,
          url: fields[`${path}.${index}.url`]?.value || '',
          order: fields[`${path}.${index}.order`]?.value || '',
        }) as MediaImageFormField,
    )
  })

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return

    dispatch({
      type: 'UPDATE',
      path: `${path}.${rows?.length || 0}`,
      value: {
        url: newImageUrl.trim(),
        order: mediaImages.length,
      },
    })

    setNewImageUrl('')
    setModified(true)
  }

  const handleRemoveImage = (index: number) => {
    removeFieldRow({ path, rowIndex: index })
    setModified(true)
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setProcessedImage(null)
    setProcessingError(null)
  }

  const handleRemoveBackground = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setProcessingError(null)
    setProcessedImage(null)

    try {
      // Build full URL if relative
      const imageUrl = selectedImage.startsWith('http')
        ? selectedImage
        : `${window.location.origin}${selectedImage}`

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove background')
      }

      // Show the processed image in the drawer
      setProcessedImage(data.url)
    } catch (error) {
      setProcessingError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddProcessedImage = () => {
    if (!processedImage) return

    // Add the processed image as a new entry in the gallery
    dispatch({
      type: 'UPDATE',
      path: `${path}.${rows?.length || 0}`,
      value: {
        url: processedImage,
        order: mediaImages.length,
      },
    })

    setModified(true)
    setProcessedImage(null)
    setSelectedImage(null)
    closeModal(DRAWER_SLUG)
  }

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${path}`} label="Images" />
      </div>

      <div className="media-image-selector">
        <div className="add-image-section">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="image URL"
            className="image-url-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddImage()
              }
            }}
          />
          <Button onClick={handleAddImage} disabled={!newImageUrl.trim()}>
            Add Image
          </Button>
        </div>

        {mediaImages.length === 0 ? (
          <p className="no-images-message">No images yet. Add your first image above.</p>
        ) : (
          <div className="image-thumbnails">
            {mediaImages.map((image, index) => (
              <DrawerToggler key={index} slug={DRAWER_SLUG}>
                <div
                  className="thumbnail-wrapper"
                  onClick={() => handleImageClick(image.url)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    className="thumbnail-image"
                  />
                  <span
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                    title="Remove image"
                  >
                    ×
                  </span>
                </div>
              </DrawerToggler>
            ))}
          </div>
        )}
      </div>

      <Drawer slug={DRAWER_SLUG} title="Image Preview">
        {selectedImage && (
          <div style={{ padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: '1', minWidth: '200px' }}>
                <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Original</p>
                <img
                  src={selectedImage}
                  alt="Original"
                  style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              {processedImage && (
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Background Removed</p>
                  <img
                    src={processedImage}
                    alt="Processed"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block',
                      background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px',
                    }}
                  />
                </div>
              )}
            </div>
            {processingError && (
              <div style={{ color: 'red', marginBottom: '10px' }}>{processingError}</div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              {!processedImage ? (
                <Button onClick={handleRemoveBackground} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Remove Background'}
                </Button>
              ) : (
                <>
                  <Button onClick={handleAddProcessedImage}>Add to Gallery</Button>
                  <Button onClick={() => setProcessedImage(null)} buttonStyle="secondary">
                    Discard
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
