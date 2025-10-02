import React from 'react'

import type { DefaultServerCellComponentProps } from 'payload'

export const ColorPickerCell: React.FC<DefaultServerCellComponentProps> = ({ cellData }) => {
  return (
    <div
      style={{
        width: '1rem',
        height: '1rem',
        backgroundColor: cellData as string,
        borderRadius: '0.25rem',
        border: '1px solid var(--theme-border)',
      }}
      title={String(cellData)}
    />
  )
}
