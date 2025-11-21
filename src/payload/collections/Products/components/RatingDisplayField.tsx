'use client'

import React from 'react'
import type { FieldType } from 'payload'

interface RatingDisplayFieldProps {
  readonly data?: {
    'rating-average'?: number
    'rating-count'?: number
  }
  readonly path?: string
}

const RatingDisplayField: React.FC<RatingDisplayFieldProps> = ({ data }) => {
  const ratingAverage = data?.['rating-average']
  const ratingCount = data?.['rating-count']

  // Render stars based on rating average
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} style={{ color: '#FFD700', fontSize: '20px' }}>
            ★
          </span>,
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} style={{ color: '#FFD700', fontSize: '20px', position: 'relative' }}>
            <span style={{ position: 'absolute', overflow: 'hidden', width: '50%' }}>★</span>
            <span style={{ color: '#D3D3D3' }}>★</span>
          </span>,
        )
      } else {
        stars.push(
          <span key={i} style={{ color: '#D3D3D3', fontSize: '20px' }}>
            ★
          </span>,
        )
      }
    }

    return stars
  }

  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        marginBottom: '16px',
      }}
    >
      <label
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#374151',
        }}
      >
        Product Rating
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Stars display */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {ratingAverage ? renderStars(ratingAverage) : renderStars(0)}
        </div>

        {/* Numeric rating */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            {ratingAverage?.toFixed(1) ?? '0.0'}
          </span>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>out of 5</span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: '#d1d5db',
          }}
        />

        {/* Review count */}
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          <span style={{ fontWeight: '600', color: '#1f2937' }}>{ratingCount ?? 0}</span>
          {' reviews'}
        </div>
      </div>

      {/* Additional info when no ratings exist */}
      {(!ratingAverage || ratingAverage === 0) && (!ratingCount || ratingCount === 0) && (
        <div style={{ marginTop: '8px', fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>
          No reviews yet
        </div>
      )}
    </div>
  )
}

export default RatingDisplayField
