'use client'

import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'

import type { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof NextLink> & {
  locale?: 'pl' | 'en'
}

/**
 * LinkWithLocale
 * Maintains `?locale=...` in the URL, defaulting to the query string value.
 */
export const LinkWithLocale = ({ href, locale, ...props }: LinkProps) => {
  const searchParams = useSearchParams()
  const currentLocale = locale || (searchParams.get('locale') as 'pl' | 'en') || 'pl'

  let fullUrl = typeof href === 'string' ? href : href.toString()

  const hasQuery = fullUrl.includes('?')
  const hasLocale = fullUrl.includes('locale=')

  if (!hasLocale) {
    fullUrl += hasQuery ? `&locale=${currentLocale}` : `?locale=${currentLocale}`
  }

  return <NextLink href={fullUrl} {...props} />
}
