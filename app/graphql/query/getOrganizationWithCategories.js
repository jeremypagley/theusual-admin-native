import gql from 'graphql-tag';

const OrganizationStoresQuery = gql`
{
  organizationCategories {
    _id
    title
    productModifiers {
      title
      options {
        title
        price
      }
    }
    productCategories {
      _id
      title
      products {
        _id
        title
        description
      }
    }
    products {
      _id,
      title,
      description
    }
    users {
      _id
    }
    stripe_refresh_token
    stripe_user_id
    billing {
      balance
      tips
    }
    
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

export default OrganizationStoresQuery;
