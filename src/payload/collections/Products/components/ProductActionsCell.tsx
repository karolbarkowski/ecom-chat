'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { ExternalLinkIcon } from '@payloadcms/ui'

const ProductActionsCell: React.FC<DefaultCellComponentProps> = ({ rowData }) => {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {rowData.url && (
        <a href={rowData.url} target="_blank" title="Open external page">
          <ExternalLinkIcon />
        </a>
      )}
    </div>
  )
}

export default ProductActionsCell
