'use client'
import React from 'react'
import { useField, useLocale } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui'
import './styles.scss'

interface LocalizedFieldDescriptionProps {
  fieldName: string
  fieldType: string
}

export const LocalizedFieldDescription: React.FC<LocalizedFieldDescriptionProps> = ({
  fieldName,
  fieldType,
}) => {
  const { value } = useField({ path: fieldName })
  const locale = useLocale()

  const handleLogValue = () => {
    console.log('=== Localized Field Value ===')
    console.log(`Field: ${fieldName}`)
    console.log(`Type: ${fieldType}`)
    console.log(`Current Locale: ${locale.code}`)
    console.log(`Current Value:`, value)
    console.log('============================')
  }

  const handleLogFieldInfo = () => {
    console.log('=== Localized Field Info ===')
    console.log({
      name: fieldName,
      type: fieldType,
      localized: true,
      currentLocale: locale.code,
      localeLabel: locale.label,
      value: value,
    })
    console.log('===========================')
  }

  return (
    <div className="localized-field-controls">
      <Button onClick={handleLogValue} buttonStyle="secondary" size="small">
        Log Value
      </Button>
      <Button onClick={handleLogFieldInfo} buttonStyle="secondary" size="small">
        Log Field Info
      </Button>
    </div>
  )
}
