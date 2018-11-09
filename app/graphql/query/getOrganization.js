import gql from 'graphql-tag';

const OrganizationQuery = gql`
{
  organization {
    _id
    title
    stripeCustomerId
    accountBalance
    
    stores {
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
        }
      }
    }
  }
}
`

export default OrganizationQuery;
