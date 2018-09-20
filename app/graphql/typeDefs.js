import gql from 'graphql-tag';

const typeDefs = `
  type Order {
    _id: String

    # TODO: Possibly change these to ids only or id for Store
    products: [Product]
    store: Store
  }

  type Store {
    _id: String
    title: String
    description: String
    hours: String
    phone: String
    website: String
    location: Location
    productCategories: [ProductCategory]
    organization: Organization
  }

  type Product {
    _id: String
    title: String
    description: String
    price: Float
    usual: Boolean
    store: Store
    productCategory: ProductCategory
    productModifiers: [ProductModifier]
  }
`

export default typeDefs
