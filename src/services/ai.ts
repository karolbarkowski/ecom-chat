const MODEL = 'nomic-embed-text-v1.5'

export type EmbedTaskType = 'search_document' | 'search_query'

export function Embed(values: string, type: EmbedTaskType): Promise<number[]>

export async function Embed(values: string[] | string, type: EmbedTaskType = 'search_query') {
  return [] as number[]
}
