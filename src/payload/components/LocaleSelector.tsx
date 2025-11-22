'use client'

import React from 'react'
import { useLocale } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import './LocaleSelector.css'
import { PL, EN, NO } from './../fields/translationManager/flags'

const localeConfig = {
  en: { code: 'en', flag: EN, name: 'English' },
  pl: { code: 'pl', flag: PL, name: 'Polski' },
  no: { code: 'no', flag: NO, name: 'Norsk' },
}

export const CustomLocaleSelector: React.FC = () => {
  const locale = useLocale()
  const router = useRouter()

  const handleLocaleChange = (newLocale: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('locale', newLocale)

    // Use router.push with the full URL including search params
    router.push(url.pathname + url.search)
  }

  return (
    <div className="custom-locale-selector">
      {Object.entries(localeConfig).map(([code, config]) => (
        <button
          key={code}
          onClick={() => handleLocaleChange(code)}
          className={`locale-flag-button ${locale.code === code ? 'active' : ''}`}
          title={config.name}
          aria-label={`Switch to ${config.name}`}
        >
          {React.createElement(config.flag)}
        </button>
      ))}
    </div>
  )
}
