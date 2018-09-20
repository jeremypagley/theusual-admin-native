import gql from 'graphql-tag';

const GET_ORDER = gql`
  {
    order {
      _id,
      items {
        _id,
        productModifiersOptions {
          title,
          price
        },
        product {
          _id,
          title,
          price
        }
      }
    }
  }
`

export default GET_ORDER;