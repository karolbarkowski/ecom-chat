/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useTransition } from 'react'

import { Button } from '@payloadcms/ui'
import { submitData } from './submitHandler'

const SheinImportUI = () => {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      await submitData()
    })
  }

  return (
    <div className="flex flex-row">
      <form onSubmit={handleSubmit}>
        <Button type="submit">Import Shein dataset</Button>
        {isPending && <p>Loading...</p>}
      </form>
    </div>
  )
}

export default SheinImportUI
