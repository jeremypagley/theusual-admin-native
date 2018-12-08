import gql from 'graphql-tag';

const OrganizationQuery = gql`
{
  organization {
    _id
    title
    stripeCustomerId
    accountBalance
    
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
