'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

const RatingDisplayCell: React.FC<DefaultCellComponentProps> = ({ rowData }) => {
  const ratingAverage = rowData?.['rating-average']
  const ratingCount = rowData?.['rating-count']

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Stars indicator */}
      <span style={{ color: '#FFD700', fontSize: '14px' }}>
        {ratingAverage ? '★'.repeat(Math.round(ratingAverage)) : '☆☆☆☆☆'}
      </span>

      {/* Rating value */}
      <span style={{ fontWeight: '600', fontSize: '13px' }}>
        {ratingAverage?.toFixed(1) ?? '0.0'}
      </span>

      {/* Review count */}
      <span style={{ fontSize: '12px', color: '#6b7280' }}>({ratingCount ?? 0})</span>
    </div>
  )
}

export default RatingDisplayCell
