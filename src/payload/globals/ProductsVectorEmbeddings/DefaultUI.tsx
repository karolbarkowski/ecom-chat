'use client'

import React, { useTransition } from 'react'

import { Button } from '@payloadcms/ui'
import { Gutter } from '@payloadcms/ui'
import { submitData } from './submitHandler'

const VectorEmbeddingsDefaultUIView = () => {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(async () => {
      submitData()
    })
  }

  return (
    <Gutter>
      <h1>Vector Embeddings</h1>

      <form onSubmit={handleSubmit}>
        <Button type="submit">Update Embeddings</Button>
        {isPending && <p>Working...</p>}
      </form>
    </Gutter>
  )
}

export default VectorEmbeddingsDefaultUIView
