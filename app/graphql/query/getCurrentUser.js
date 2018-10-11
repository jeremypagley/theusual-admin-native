import gql from 'graphql-tag';

const GET_CURRENT_USER = gql`
  query User {
    currentUser {
      _id,
      email,
      order {
        _id
      },
      billing {
        balance,
        stripeCustomer {
          id
          default_source
        }
      }
      usuals {
        _id,
        deleted,
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