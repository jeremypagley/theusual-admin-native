import React from 'react';
import { 
  Container,
  Content,
  Header,
  View,
  Button,
  Text
} from 'native-base';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import GradientButton from 'app/components/GradientButton';
import CardList from 'app/components/CardList';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import GET_ORGANIZATION from 'app/graphql/query/getOrganization';
import { Query } from 'react-apollo';
import Auth from 'app/auth';
import { Constants } from 'expo';
import ButtonStyles from 'app/styles/generic/ButtonStyles';

const {
  apiEndpoint
} = Auth.getKeys();


class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDevSettings: false
    }
  }

  render() {
    const { currentUser, loading, error } = this.props.data;
    const manifest = Constants.manifest;
    const buildNumber = manifest.ios.buildNumber;
    const version = manifest.version;
    const releaseChannel = manifest.releaseChannel;

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

          {!this.state.showDevSettings
          ? null
          : <CardList
              data={[
                {
                  _id: apiEndpoint,
                  title: "apiEndpoint:",
                  subtitle: apiEndpoint
                },
                {
                  _id: version,
                  title: "version:",
                  subtitle: version
                },
                {
                  _id: buildNumber,
                  title: "buildNumber:",
                  subtitle: buildNumber
                },
                {
                  _id: releaseChannel,
                  title: "releaseChannel:",
                  subtitle: releaseChannel
                }
              ]}
              rightActionItem={<View></View>}
            />
          }

          <Button 
            block 
            style={ButtonStyles.secondaryButton}
            onPress={() => this.setState({showDevSettings: true})}
          >
            <Text style={ButtonStyles.secondaryButtonText}>Version Info</Text>
          </Button>

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
