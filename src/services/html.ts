import he from 'he'

export const decodeHTMLEntities = (text: string) => he.decode(text)
