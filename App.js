import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import Register from './app/scenes/Register';
import Login from './app/scenes/Login';
import Profile from './app/scenes/Profile';

import { signIn, signOut, getToken } from './util';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const authLink = setContext(async (req, { headers }) => {
  const token = await getToken();

  return {
    ...headers,
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = authLink.concat(httpLink);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const AuthStack = StackNavigator({
  Register: { screen: Register, navigationOptions: { headerTitle: 'Register' } },
  Login: { screen: Login, navigationOptions: { headerTitle: 'Login' } },
});

const LoggedInStack = StackNavigator({
  Profile: { screen: Profile, navigationOptions: { headerTitle: 'Profile' } },
});

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }

  async componentWillMount() {
    const token = await getToken();
    console.log('token: ', token)
    if (token) {
      this.setState({ loggedIn: true });
    }
  }

  handleChangeLoginState = (loggedIn = false, jwt) => {
    console.log('handleChangeLoginState, jwt; ', jwt)
    this.setState({ loggedIn });
    if (loggedIn) {
      signIn(jwt);
    } else {
      signOut();
    }
  };

  render() {
    return (
      <ApolloProvider client={client}>
        {this.state.loggedIn ?
          <LoggedInStack screenProps={{ changeLoginState: this.handleChangeLoginState }} /> :
          <AuthStack screenProps={{ changeLoginState: this.handleChangeLoginState }} />}
      </ApolloProvider>
    );
  }
}
