import gql from 'graphql-tag';

const GET_CURRENT_USER = gql`
  query User {
    currentUser {
      _id,
      email,
      order,
      usuals {
        _id,
        items {
          _id,
          product {
            _id,
            title,
            description,
            price,
          }
          productModifiersOptions {
            title,
            price
          }
        }
        store {
          _id,
          title,
          location {
            longitude,
            latitude,
            address
          }
        }
      }
    }
  }
`

export default GET_CURRENT_USER;