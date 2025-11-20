'use client'
import './index.scss'
import { ArrayFieldClientComponent } from 'payload'
import React, { memo, useCallback, useMemo } from 'react'
import { useField, useForm, useFormFields, Button, FieldLabel } from '@payloadcms/ui'

/**
 * Interface for Tag component props
 */
interface TagProps {
  /** Unique identifier for the tag */
  id: string
  /** Display value of the tag */
  value: string
  /** Callback function to remove the tag */
  onRemove: (index: number) => void
  /** Index of the tag in the array */
  index: number
}

/**
 * Memoized Tag component that renders an individual tag with delete functionality
 * @component
 */
const Tag = memo(({ value, onRemove, index }: TagProps) => (
  <div className="tag-item">
    <span className="tag-value">{value}</span>
    <button
      onClick={() => onRemove(index)}
      type="button"
      className="tag-remove-button"
      title="Remove tag"
    >
      ×
    </button>
  </div>
))

Tag.displayName = 'Tag'

/**
 * Custom array field component for managing tags in Payload CMS
 * @component
 * @param {Object} props - Component props from Payload CMS
 * @param {string} props.path - Path to the field in the form
 */
const TagsArrayComponent: ArrayFieldClientComponent = ({ path }) => {
  const { rows } = useField({ path, hasRows: true })
  const { addFieldRow, removeFieldRow, setModified } = useForm()
  const { dispatch } = useFormFields(([_, dispatch]) => ({ dispatch }))
  const [newTagValue, setNewTagValue] = React.useState('')

  /**
   * Get tag values from form fields
   */
  const tags = useFormFields(([fields]) =>
    rows?.map((row, index: number) => ({
      id: row.id,
      value: (fields[`${path}.${index}.tag`]?.value as string) || '',
    })),
  ) as Array<{ id: string; value: string }> | undefined

  /**
   * Handles adding a new tag to the array
   */
  const handleAddRow = useCallback(() => {
    if (!newTagValue.trim()) return

    addFieldRow({
      path: 'tags',
      schemaPath: `${path}.0.tag`,
    })

    setTimeout(() => {
      dispatch({
        type: 'UPDATE',
        path: `${path}.${rows?.length || 0}.tag`,
        value: newTagValue.trim(),
      })
      setNewTagValue('')
      setModified(true)
    }, 0)
  }, [addFieldRow, dispatch, path, rows?.length, newTagValue, setModified])


  /**
   * Handles removing a tag from the array
   */
  const handleRemoveTag = useCallback(
    (index: number) => {
      removeFieldRow({ path, rowIndex: index })
      setModified(true)
    },
    [removeFieldRow, path, setModified],
  )

  /**
   * Memoized tag list rendering
   */
  const tagList = useMemo(
    () => (
      <div className="tags-list">
        {tags?.map((tag, index) => (
          <Tag
            key={tag.id}
            id={tag.id}
            value={tag.value}
            onRemove={handleRemoveTag}
            index={index}
          />
        ))}
      </div>
    ),
    [tags, handleRemoveTag],
  )

  return (
    <div className="field-type tags-array-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${path}`} label="Tags" />
      </div>

      {tags && tags.length > 0 && <div className="tags-display">{tagList}</div>}

      <div className="add-tag-section">
        <input
          type="text"
          value={newTagValue}
          onChange={(e) => setNewTagValue(e.target.value)}
          placeholder="Enter tag name"
          className="tag-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddRow()
            }
          }}
        />
        <Button onClick={handleAddRow} disabled={!newTagValue.trim()}>
          Add Tag
        </Button>
      </div>
    </div>
  )
}

export default memo(TagsArrayComponent)
