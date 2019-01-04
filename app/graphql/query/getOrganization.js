import gql from 'graphql-tag';

const OrganizationQuery = gql`
{
  organization {
    _id
    title
    stripeCustomerId
    accountBalance

    users {
      _id
      firstName
      lastName
      email
    }
    
    stores {
      _id
      title
      description
      hours {
        start
        end
      }
      phone
      website
      location {
        address
      }
    }
  }
}
`

export default OrganizationQuery;
