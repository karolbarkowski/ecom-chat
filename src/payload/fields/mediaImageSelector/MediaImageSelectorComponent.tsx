/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import { UIFieldClientProps } from 'payload'
import { useFormFields, useForm, Button, FieldLabel } from '@payloadcms/ui'
import './index.scss'

type MediaImageFormField = {
  id?: string // Payload auto-generates IDs for array items
  url: string
  order: number
}

type MediaImageSelectorProps = {
  arrayFieldPath: string
} & UIFieldClientProps

export const MediaImageSelectorComponent: React.FC<MediaImageSelectorProps> = ({
  arrayFieldPath,
}) => {
  const { dispatchFields } = useForm()
  const [newImageUrl, setNewImageUrl] = useState('')

  // Get the mediaImages array from the form
  const mediaImages = useFormFields(([fields]) => {
    const imagesCount = fields[arrayFieldPath]?.rows?.length || 0

    const formImages = [] as MediaImageFormField[]
    for (let i = 0; i < imagesCount; i++) {
      formImages.push({
        id: fields[`${arrayFieldPath}.${i}.id`]?.value,
        url: fields[`${arrayFieldPath}.${i}.url`]?.value,
        order: fields[`${arrayFieldPath}.${i}.order`]?.value,
      } as MediaImageFormField)
    }

    return formImages
  })

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return

    const newImage: MediaImageFormField = {
      url: newImageUrl.trim(),
      order: mediaImages.length,
    }

    const updatedImages = [...mediaImages, newImage]

    // Dispatch field updates for each item individually
    updatedImages.forEach((img, idx) => {
      dispatchFields({
        type: 'UPDATE',
        path: `${arrayFieldPath}.${idx}.url`,
        value: img.url,
      })
      dispatchFields({
        type: 'UPDATE',
        path: `${arrayFieldPath}.${idx}.order`,
        value: img.order,
      })
      if (img.id) {
        dispatchFields({
          type: 'UPDATE',
          path: `${arrayFieldPath}.${idx}.id`,
          value: img.id,
        })
      }
    })

    // Update the rows metadata
    dispatchFields({
      type: 'UPDATE',
      path: arrayFieldPath,
      rows: updatedImages.map((img) => ({ id: img.id || crypto.randomUUID() })),
    })

    setNewImageUrl('')
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = mediaImages.filter((_, idx) => idx !== index)

    // Update the rows metadata first
    dispatchFields({
      type: 'UPDATE',
      path: arrayFieldPath,
      rows: updatedImages.map((img) => ({ id: img.id || crypto.randomUUID() })),
    })

    // Dispatch field updates for remaining items
    updatedImages.forEach((img, idx) => {
      dispatchFields({
        type: 'UPDATE',
        path: `${arrayFieldPath}.${idx}.url`,
        value: img.url,
      })
      dispatchFields({
        type: 'UPDATE',
        path: `${arrayFieldPath}.${idx}.order`,
        value: idx, // Update order to reflect new positions
      })
      if (img.id) {
        dispatchFields({
          type: 'UPDATE',
          path: `${arrayFieldPath}.${idx}.id`,
          value: img.id,
        })
      }
    })
  }

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${arrayFieldPath}`} label="Images" />
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
              <div key={index} className="thumbnail-wrapper">
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="thumbnail-image"
                />
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage(index)
                  }}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
