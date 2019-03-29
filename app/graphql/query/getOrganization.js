import gql from 'graphql-tag';

const OrganizationQuery = gql`
{
  organization {
    _id
    title
    stripe_refresh_token
    stripe_user_id
    billing {
      balance
      tips
    }

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
