import React from 'react';
import { 
  Container,
  Content,
  Header,
  View,
  Button,
  Text,
  Toast
} from 'native-base';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import GradientButton from 'app/components/GradientButton';
import CardList from 'app/components/CardList';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import GET_ORGANIZATION from 'app/graphql/query/getOrganization';
import { Query } from 'react-apollo';
import Auth from 'app/auth';
import { Constants, WebBrowser, Linking } from 'expo';
import ButtonStyles from 'app/styles/generic/ButtonStyles';
import Colors from 'app/styles/Colors';
import CardStyles from 'app/styles/generic/CardStyles';

const {
  apiEndpoint,
  stripeClientId
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
              title="You"
            />
          }

          <Query query={GET_ORGANIZATION}>
            {({ loading, error, data, refetch }) => {
              if (loading) return <LoadingIndicator title="Loading organization info" />;
              if (error) return <GenericError message={error.message} />;
              
              const organization = data.organization;
              if (!organization) return null

              let orgUsers = organization.users.map(user => {
                return {
                  _id: user._id,
                  title: `${user.email}`,
                  subtitle: `${user.firstName} ${user.lastName}`
                }
              });

              let orgBalance = [
                {
                  _id: 'amount',
                  title: `$${organization.billing.balance/100}`,
                  subtitle: `Balance`
                },
                {
                  _id: 'tips',
                  title: `$${organization.billing.tips/100}`,
                  subtitle: `Tips`
                },
              ]

              const hasStripePayments = organization.stripe_user_id;
              let stripeAuthorizeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${stripeClientId}&scope=read_write&state=${organization._id}`

              // To test you must use the test url from stripe
              // stripeAuthorizeUrl = `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_EguFfQcjqGz1uYd7UHfCJIOwi0yvcukp&scope=read_write&state=${organization._id}`
              const paymentsNode = this._getPaymentsNode(hasStripePayments, stripeAuthorizeUrl, refetch);

              // It seems to refresh when an order is completed and when you click on a location to start with
              // const cardFooterAction = data.networkStatus === 4 ? <Spinner color={Colors.BrandRed} /> : <Text style={CardStyles.itemButtonTitle}>Refresh</Text>;

              return (
                <View>
                  <CardList
                    data={[{
                      _id: organization._id,
                      title: organization.title,
                    }]}
                    rightActionItem={<View></View>}
                    title="Organization"
                  />
                  <CardList
                    smallTitle
                    data={orgUsers}
                    title={`Users`}
                    loading={loading}
                    rightActionItem={<View></View>}
                  />
                  
                  {/* <CardList
                    smallTitle
                    data={orgBalance}
                    title={`Account`}
                    loading={loading}
                    rightActionItem={<View></View>}
                    // cardFooter={
                    //   <CardItem footer button onPress={() => refetch()} style={[CardStyles.itemFooter, {paddingTop: 15}]}>
                    //     <Left />
                    //     <Right>
                    //       {cardFooterAction}
                    //     </Right>
                    //   </CardItem>
                    // }
                  /> */}

                  {paymentsNode}
                </View>
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
  
  _getPaymentsNode = (hasStripePayments, stripeAuthorizeUrl, refetch) => {
    const { redirectData } = this.state;

    if (redirectData && redirectData.path === 'stripe/auth/' && redirectData.queryParams.access && redirectData.queryParams.access === 'granted') {
      // Refetch org data
      refetch();
      Toast.show({
        text: 'Your payments are setup successfully 💸',
        buttonText: 'Great',
        duration: 3000,
        type: 'success',
        style: {
          backgroundColor: Colors.BrandRed,
          color: Colors.White
         }
      })
    }

    if (hasStripePayments) {
      // TODO: Show Successful connected account https://www.youtube.com/watch?v=AwklziE5HKo
      return (
        <View>
          <Button 
            block 
            style={ButtonStyles.secondaryButton}
            onPress={() => WebBrowser.openBrowserAsync('https://dashboard.stripe.com/dashboard')}
          >
            <Text style={ButtonStyles.secondaryButtonText}>View Stripe Dashboard</Text>
          </Button>
          <Button 
            block 
            style={ButtonStyles.secondaryButton}
            onPress={() => WebBrowser.openBrowserAsync('https://www.youtube.com/watch?v=AwklziE5HKo')}
          >
            <Text style={ButtonStyles.secondaryButtonText}>Using the Stripe Dashboard Tutorial</Text>
          </Button>
        </View>
      )
    } else {
      return (
        <Button 
          block 
          style={ButtonStyles.secondaryButton}
          onPress={() => this._openWebBrowserAsync(stripeAuthorizeUrl)}
        >
          <Text style={ButtonStyles.secondaryButtonText}>Setup Payments</Text>
        </Button>
      );
    }
  }
  
  _handleRedirect = event => {
    WebBrowser.dismissBrowser();

    let data = Linking.parse(event.url);

    this.setState({ redirectData: data });
  };

  _openWebBrowserAsync = async (stripeAuthorizeUrl) => {
    try {
      this._addLinkingListener();
      let result = await WebBrowser.openBrowserAsync(
        stripeAuthorizeUrl
      );
      this._removeLinkingListener();
      this.setState({ result });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  _addLinkingListener = () => {
    Linking.addEventListener('url', this._handleRedirect);
  };

  _removeLinkingListener = () => {
    Linking.removeEventListener('url', this._handleRedirect);
  };

  _maybeRenderRedirectData = () => {
    if (!this.state.redirectData) {
      return;
    }

    return <Text>{JSON.stringify(this.state.redirectData)}</Text>;
  };

}

export default ProfileContainer;
