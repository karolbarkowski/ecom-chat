export interface Tramp4Import {
  nokaut: Nokaut
}

export interface Nokaut {
  offers: Offers
}

export interface Offers {
  offer: Offer[]
}

export interface Offer {
  id: string
  name: string
  description: string
  url: string
  image: string
  price: string
  category: string
  shopcategory: string
  producer: string
  property: Property[]
  availability: string
  shipping: string
}

export interface Property {
  name: string
  '#text'?: string
}
