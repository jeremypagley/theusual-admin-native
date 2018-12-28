import gql from 'graphql-tag';

const ProductsQuery = gql`
  query products($productCategoryId: String!) {
    products(productCategoryId: $productCategoryId) {
      _id,
      title,
      description,
      price,
      store {
        _id,
        title
      },
      productModifiers {
        _id
        title
        options {
          title
          price
        }
      }
    }
  }
`

export default ProductsQuery;
