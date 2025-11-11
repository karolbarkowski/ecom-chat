/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import { ArrayFieldClientComponent } from 'payload'
import { useFormFields, useForm, Button, FieldLabel, useField } from '@payloadcms/ui'
import './index.scss'

type MediaImageFormField = {
  id?: string // Payload auto-generates IDs for array items
  url: string
  order: number
}

export const MediaImageSelectorComponent: ArrayFieldClientComponent = ({ path }) => {
  const { rows } = useField({ path, hasRows: true })
  const { removeFieldRow, setModified } = useForm()
  const { dispatch } = useFormFields(([_, dispatch]) => ({ dispatch }))
  const [newImageUrl, setNewImageUrl] = useState('')

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
