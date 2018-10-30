import gql from 'graphql-tag';

const GET_ORDER_HISTORY = gql`
  {
    userOrderHistory {
      _id,
      orderHistory {
        _id
        orderedDate,
        items {
          _id,
          productModifiersOptions {
            title,
            price
          }
          product {
            _id,
            title,
            price
          }
        }
      }
    }
  }
`
export default GET_ORDER_HISTORY;
