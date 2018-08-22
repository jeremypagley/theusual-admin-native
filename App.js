import React, { Component } from 'react';

import { signIn, signOut, getToken } from './util';
import AppNavigator from 'app/nav/AppNavigator';
import AuthNavigator from 'app/nav/AuthNavigator';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import resolvers from 'app/graphql/resolvers';
import typeDefs from 'app/graphql/typeDefs';

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });
const cache = new InMemoryCache();

const authLink = setContext(async (req, { headers }) => {
  const token = await getToken();

  return {
    ...headers,
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const defaultLocalState = {
  order: {
    __typename: 'LocalOrder',
    products: [
      // {
      //   __typename: 'LocalProduct',
      //   _id: '99',
      //   title: 'Product Title Coffee',
      //   price: 4.0,
      //   modifiers: [
      //     {
      //       __typename: 'LocalModifier',
      //       title: 'Modifier Title Milk',
      //       price: 1.0
      //     }
      //   ]
      // }
    ],
  }
};

const stateLink = withClientState({
  cache,
  // resolvers,
  // typeDefs: [typeDefs],
  // defaults: defaultLocalState
});

const link = authLink.concat(httpLink);
const client = new ApolloClient({
  cache: cache,
  link:  ApolloLink.from([stateLink, link]),
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
          <AppNavigator screenProps={{ changeLoginState: this.handleChangeLoginState }} /> :
          <AuthNavigator screenProps={{ changeLoginState: this.handleChangeLoginState }} />}
      </ApolloProvider>
    );
  }
}
