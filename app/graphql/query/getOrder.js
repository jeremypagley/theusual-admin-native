import gql from 'graphql-tag';

const GET_ORDER = gql`
  {
    order {
      _id
      items {
        _id
        productModifiersOptions {
          title
          price
        }
        product {
          _id
          title
          price
        }
      }
      store {
        _id
        title
        hours {
          start
          end
        }
        location {
          address
        }
      }
    }
  }
`

export default GET_ORDER;