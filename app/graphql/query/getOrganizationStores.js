import gql from 'graphql-tag';

const OrganizationStoresQuery = gql`
  query organizationStores($storeId: String) {
    organizationStores(storeId: $storeId) {
      _id
      title
      products {
        _id,
        title,
        description
      }
      users {
        _id
      }
      stripeCustomerId
      accountBalance
      
      stores {
        _id
        title,
        description,
        orderQueue {
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
              description
              price
              productCategory {
                _id
                title
              }
              productModifiers {
                _id
                title
              }
            }
          }
          orderedDate
          orderedBy {
            _id
            firstName
            lastName
          }
          queueStatus
        }
        hours {
          start
          end
        },
        phone,
        website,
        location {
          address
        },
        unavailableProducts {
          _id
        }
        productCategories {
          _id,
          title,
          products {
            _id,
            title,
            description
            productModifiers {
              _id
              title
            }
          }
        }
      }

    }
  }
`

export default OrganizationStoresQuery;
