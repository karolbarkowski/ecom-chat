import { XMLParser } from 'fast-xml-parser'

const parseFile = async (fileName: string): Promise<string> => {
  const parserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true,
  }

  const xml = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/data/${fileName}.xml`)
  const text = await xml.text()

  const parser = new XMLParser(parserOptions)
  return parser.parse(text)
}

export { parseFile }
