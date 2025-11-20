import type { CollectionAfterReadHook } from 'payload'

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the author manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthor` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req, req: { payload } }) => {
  if (doc?.author) {
    const authorDoc = await payload.findByID({
      id: typeof doc.author === 'object' ? doc.author?.id : doc.author,
      collection: 'users',
      depth: 0,
      req,
    })

    if (authorDoc) {
      doc.populatedAuthor = {
        id: authorDoc.id,
        name: authorDoc.email,
      }
    }
  }

  return doc
}
