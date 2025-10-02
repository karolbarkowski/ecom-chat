/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useTransition } from 'react'

import { Button } from '@payloadcms/ui'
import { submitData } from './submitHandler'

const CenterSportImportUI = () => {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      await submitData()
    })
  }

  return (
    <div className="flex flex-row">
      <img
        className="image"
        src="/data/Centersport.logo.png"
        width={130}
        height={30}
        alt="Centersport Logo"
      />

      <form onSubmit={handleSubmit}>
        <Button type="submit">Import</Button>
        {isPending && <p>Loading...</p>}
      </form>
    </div>
  )
}

export default CenterSportImportUI
