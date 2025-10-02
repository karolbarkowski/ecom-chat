'use client'
import './index.scss'
import { TextFieldClientComponent } from 'payload'
import React from 'react'
import { cn } from '@/payload/utilities/cn'
import { FieldLabel, useField } from '@payloadcms/ui'

type Color = {
  name: string
  hex: string
}

const colors: Array<Color> = [
  {
    name: 'Red',
    hex: '#ff0000',
  },
  {
    name: 'Green',
    hex: '#00ff00',
  },
  {
    name: 'Blue',
    hex: '#0000ff',
  },
]

export const ColorPickerComponent: TextFieldClientComponent = ({ field: clientField, path }) => {
  const { label } = clientField

  const { value, setValue } = useField<string>({ path: path || clientField.name })
  const onColorClick = (e: Color) => {
    setValue(e.hex)
  }

  return (
    <div className="field-type color-picker-component">
      <FieldLabel htmlFor={`field-${path}`} label={label} />

      <div className="color-selection-wrapper">
        {colors.map((color) => (
          <div
            key={color.name}
            className={cn('color-swatch', { selected: color.hex === value })}
            style={{ backgroundColor: color.hex }}
            onClick={() => onColorClick(color)}
          ></div>
        ))}
      </div>
    </div>
  )
}
