import React from 'react';
import { 
  Container,
  Content,
  Header,
  View
} from 'native-base';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import GradientButton from 'app/components/GradientButton';
import CardList from 'app/components/CardList';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import GET_ORGANIZATION from 'app/graphql/query/getOrganization';
import { Query } from 'react-apollo';

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser, loading, error } = this.props.data;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={[ContainerStyles.header]}></Header>

        <Content padder style={ContainerStyles.content}>
          {loading && <LoadingIndicator title="Loading your info" />}
          {error && <GenericError message={error.message} />}

          {loading || error 
          ? null
          : <CardList
              data={[{
                _id: currentUser._id,
                title: `${currentUser.firstName} ${currentUser.lastName}`,
                subtitle: currentUser.email
              }]}
              rightActionItem={<View></View>}
              title="Your Info"
            />
          }

          <Query query={GET_ORGANIZATION}>
            {({ loading, error, data }) => {
              if (loading) return <LoadingIndicator title="Loading organization info" />;
              if (error) return <GenericError message={error.message} />;
              
              const organization = data.organization;
              if (!organization) return null

              let orgUsers = organization.users.map(user => {
                return {
                  _id: user._id,
                  title: `${user.firstName} ${user.lastName}`,
                  subtitle: `${user.email}`
                }
              })

              return (
                <CardList
                  data={orgUsers}
                  title={`${organization.title} - Users`}
                  loading={loading}
                  rightActionItem={<View></View>}
                />
              )
            }}
          </Query>

          <GradientButton 
            title="Logout"
            buttonProps={{onPress: () => this.props.onLogout()}}
          />

        </Content>
      </Container>
    );
  }

}

export default ProfileContainer;
