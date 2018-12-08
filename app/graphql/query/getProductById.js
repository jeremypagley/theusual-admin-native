import gql from 'graphql-tag';

const ProductByIdQuery = gql`
  query productById($productId: String!) {
    productById(productId: $productId) {
      _id,
      title,
      description,
      price,
      store {
        _id,
        title
      },
      productModifiers {
        _id,
        title,
        options {
          title,
          price
        }
      }
    }
  }
`

export default ProductByIdQuery;
