import React, { Component } from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Register from 'app/scenes/Register';
import Login from 'app/scenes/Login';
import Profile from 'app/scenes/Profile';
import Order from 'app/scenes/Order';
import Usuals from 'app/scenes/Usuals';

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

const AuthStack = createStackNavigator({
  Register: { screen: Register, navigationOptions: { headerTitle: 'Register' } },
  Login: { screen: Login, navigationOptions: { headerTitle: 'Login' } },
});

const HomeStack = createStackNavigator({
  Usuals: { screen: Usuals },
},
{
  headerMode: 'none',
});

const OrderStack = createStackNavigator({
  Order: { screen: Order },
},
{
  headerMode: 'none',
});

const MainStack = createBottomTabNavigator({
  Home: HomeStack,
  Order: OrderStack,
  Profile: Profile,
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
    if (token) {
      this.setState({ loggedIn: true });
    }
  }

  handleChangeLoginState = (loggedIn = false, jwt) => {
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
          <MainStack screenProps={{ changeLoginState: this.handleChangeLoginState }} /> :
          <AuthStack screenProps={{ changeLoginState: this.handleChangeLoginState }} />}
      </ApolloProvider>
    );
  }
}
