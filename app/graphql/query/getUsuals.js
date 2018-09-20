import gql from 'graphql-tag';

const GET_USUALS = gql`
  {
    usual {
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

export default GET_USUALS;