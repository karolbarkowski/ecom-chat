'use client'
import React, { useState } from 'react'
import { Locale, UIFieldClientComponent } from 'payload'
import { Button, FieldLabel, useConfig } from '@payloadcms/ui'
import { PL, EN, NO } from './flags'
import './index.scss'

const countryCodeFlags: Record<string, React.FC> = {
  en: EN,
  pl: PL,
  no: NO,
}

export const TranslationManagerComponent: UIFieldClientComponent = () => {
  const config = useConfig()
  const locales: Locale[] = config.config?.localization?.locales || []

  // Extract locale codes from the locale objects
  const localeCodes = locales.map((locale) => (typeof locale === 'string' ? locale : locale.code))

  const [sourceLocale, setSourceLocale] = useState<string>(localeCodes[0] || 'en')
  const [targetLocale, setTargetLocale] = useState<string>(localeCodes[1] || 'pl')
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    setIsTranslating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsTranslating(false)
  }

  return (
    <div className="field-type translation-manager">
      <div className="label-wrapper">
        <FieldLabel label="Auto Translate" />
      </div>
      <div className="translation-manager-content">
        <div className="locale-selection-section">
          <div className="flag-group">
            {localeCodes.map((locale) => (
              <button
                key={`source-${locale}`}
                type="button"
                className={`flag-button ${sourceLocale === locale ? 'selected' : ''} ${locale === targetLocale ? 'disabled' : ''}`}
                onClick={() => setSourceLocale(locale)}
                disabled={locale === targetLocale}
                title={`Source: ${locale.toUpperCase()}`}
              >
                {React.createElement(countryCodeFlags[locale])}
              </button>
            ))}
          </div>

          <div className="flag-group">
            {localeCodes.map((locale) => (
              <button
                key={`target-${locale}`}
                type="button"
                className={`flag-button ${targetLocale === locale ? 'selected' : ''} ${locale === sourceLocale ? 'disabled' : ''}`}
                onClick={() => setTargetLocale(locale)}
                disabled={locale === sourceLocale}
                title={`Target: ${locale.toUpperCase()}`}
              >
                {React.createElement(countryCodeFlags[locale])}
              </button>
            ))}
          </div>

          <Button
            onClick={handleTranslate}
            disabled={isTranslating || sourceLocale === targetLocale}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </Button>
        </div>
      </div>
    </div>
  )
}
