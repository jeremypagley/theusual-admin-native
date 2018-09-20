import React, { Component } from 'react';

import { signIn, signOut, getToken } from './util';
import AppNavigator from 'app/nav/AppNavigator';
import AuthNavigator from 'app/nav/AuthNavigator';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { View } from 'react-native';
import OrderStatus from 'app/containers/OrderStatus';

import resolvers from 'app/graphql/resolvers';
import typeDefs from 'app/graphql/typeDefs';

console.ignoredYellowBox = ['Remote debugger'];

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
        {/* {this.state.loggedIn
        ? (
            <View style={{flex: 1}}>
              <AppNavigator screenProps={{ changeLoginState: this.handleChangeLoginState }} />
              <OrderStatus />
            </View>
          )
        : (
            <AuthNavigator screenProps={{ changeLoginState: this.handleChangeLoginState }} />
          )
        } */}
              <AppNavigator screenProps={{ changeLoginState: this.handleChangeLoginState }} />

      </ApolloProvider>
    );
  }
}

// import React from 'react';
// import { Platform, StatusBar, StyleSheet, View } from 'react-native';
// import { AppLoading, Asset, Font, Icon } from 'expo';
// import AppNavigator from './navigation/AppNavigator';

// export default class App extends React.Component {
//   state = {
//     isLoadingComplete: false,
//   };

//   render() {
//     if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
//       return (
//         <AppLoading
//           startAsync={this._loadResourcesAsync}
//           onError={this._handleLoadingError}
//           onFinish={this._handleFinishLoading}
//         />
//       );
//     } else {
//       return (
//         <View style={styles.container}>
//           {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
//           <AppNavigator />
//         </View>
//       );
//     }
//   }

//   _loadResourcesAsync = async () => {
//     return Promise.all([
//       Asset.loadAsync([
//         require('./assets/images/robot-dev.png'),
//         require('./assets/images/robot-prod.png'),
//       ]),
//       Font.loadAsync({
//         // This is the font that we are using for our tab bar
//         ...Icon.Ionicons.font,
//         // We include SpaceMono because we use it in HomeScreen.js. Feel free
//         // to remove this if you are not using it in your app
//         'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
//       }),
//     ]);
//   };

//   _handleLoadingError = error => {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };

//   _handleFinishLoading = () => {
//     this.setState({ isLoadingComplete: true });
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });
