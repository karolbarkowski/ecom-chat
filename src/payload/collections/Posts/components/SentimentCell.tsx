'use client'

import React from 'react'

interface SentimentCellProps {
  rowData: {
    sentiment?: string
  }
}

const SentimentCell: React.FC<SentimentCellProps> = ({ rowData }) => {
  const { sentiment } = rowData

  const getBulbColor = () => {
    switch (sentiment) {
      case '1':
        return '#22c55e' // green
      case '0':
        return '#9ca3af' // gray
      case '-1':
        return '#ef4444' // red
      default:
        return '#d1d5db' // light gray for undefined
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="6" fill={getBulbColor()} />
      </svg>
    </div>
  )
}

export default SentimentCell
