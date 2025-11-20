'use client'
import './index.scss'
import React, { useEffect, useState } from 'react'
import { RelationshipFieldClientComponent } from 'payload'
import { useField, useConfig, Button } from '@payloadcms/ui'

interface Comment {
  id: string
  content: string
  user: {
    id: string
    name?: string
    email?: string
  }
  createdAt?: string
}

const CommentsTableComponent: RelationshipFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<string[]>({ path })
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [availableComments, setAvailableComments] = useState<Comment[]>([])
  const config = useConfig()

  useEffect(() => {
    const fetchComments = async () => {
      if (!value || value.length === 0) {
        setComments([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const commentIds = Array.isArray(value) ? value : [value]

        // Fetch comments with user data
        const responses = await Promise.all(
          commentIds.map((id) =>
            fetch(`${config.config.serverURL}/api/post-comments/${id}?depth=1`, {
              credentials: 'include',
            }).then((res) => res.json())
          )
        )

        setComments(responses.filter(Boolean))
      } catch (error) {
        console.error('Error fetching comments:', error)
        setComments([])
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [value, config.config.serverURL])

  // Fetch available comments for adding
  useEffect(() => {
    const fetchAvailableComments = async () => {
      try {
        const response = await fetch(`${config.config.serverURL}/api/post-comments?limit=100`, {
          credentials: 'include',
        })
        const data = await response.json()

        // Filter out already added comments
        const currentIds = Array.isArray(value) ? value : []
        const available = data.docs.filter((comment: Comment) => !currentIds.includes(comment.id))
        setAvailableComments(available)
      } catch (error) {
        console.error('Error fetching available comments:', error)
      }
    }

    if (showAddDialog) {
      fetchAvailableComments()
    }
  }, [showAddDialog, value, config.config.serverURL])

  const handleRemoveComment = (commentId: string) => {
    const currentIds = Array.isArray(value) ? value : []
    const newIds = currentIds.filter((id) => id !== commentId)
    setValue(newIds)
  }

  const handleAddComment = (commentId: string) => {
    const currentIds = Array.isArray(value) ? value : []
    setValue([...currentIds, commentId])
    setShowAddDialog(false)
  }

  if (loading) {
    return (
      <div className="comments-table-component">
        <div className="loading-state">Loading comments...</div>
      </div>
    )
  }

  return (
    <div className="comments-table-component">
      <div className="comments-header">
        <Button onClick={() => setShowAddDialog(true)} buttonStyle="primary" size="small">
          Add Comment
        </Button>
      </div>

      {!comments || comments.length === 0 ? (
        <div className="empty-state">No comments yet</div>
      ) : (
        <table className="comments-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Comment</th>
              <th>Date</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td className="author-cell">
                  {typeof comment.user === 'object'
                    ? comment.user.name || comment.user.email || 'Unknown'
                    : 'Unknown'}
                </td>
                <td className="content-cell">{comment.content}</td>
                <td className="date-cell">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleRemoveComment(comment.id)}
                    className="remove-comment-btn"
                    type="button"
                    title="Remove comment"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddDialog && (
        <div className="add-comment-dialog">
          <div className="dialog-header">
            <h3>Add Comment</h3>
            <button
              onClick={() => setShowAddDialog(false)}
              className="close-dialog-btn"
              type="button"
            >
              ×
            </button>
          </div>
          <div className="dialog-content">
            {availableComments.length === 0 ? (
              <p className="no-available-comments">No available comments to add</p>
            ) : (
              <div className="available-comments-list">
                {availableComments.map((comment) => (
                  <div key={comment.id} className="available-comment-item">
                    <div className="comment-preview">
                      <div className="comment-author">
                        {typeof comment.user === 'object'
                          ? comment.user.name || comment.user.email || 'Unknown'
                          : 'Unknown'}
                      </div>
                      <div className="comment-content">{comment.content}</div>
                    </div>
                    <Button
                      onClick={() => handleAddComment(comment.id)}
                      buttonStyle="secondary"
                      size="small"
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentsTableComponent
