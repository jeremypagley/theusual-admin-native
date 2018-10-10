import React, { Component } from 'react';

import { signIn, signOut, getToken } from './util';
import AppNavigator from 'app/nav/AppNavigator';
import AuthNavigator from 'app/nav/AuthNavigator';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { Font, Icon, AppLoading } from 'expo';
import OrderStatus from 'app/containers/OrderStatus';

import resolvers from 'app/graphql/resolvers';
import typeDefs from 'app/graphql/typeDefs';
import { Content, Spinner, Container, H2, View } from 'native-base';
import Colors from './app/styles/Colors';
import TypographyStyles from './app/styles/generic/TypographyStyles';

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
      isLoadingComplete: false
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
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      // Asset.loadAsync([
      //   require('./assets/images/robot-dev.png'),
      //   require('./assets/images/robot-prod.png'),
      // ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'montserrat-black': require('./assets/fonts/Montserrat-Black.ttf'),
        'montserrat-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        'montserrat-italic': require('./assets/fonts/Montserrat-Italic.ttf'),
        'montserrat-medium': require('./assets/fonts/Montserrat-Medium.ttf'),
        'montserrat-semibold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
        'montserrat-light': require('./assets/fonts/Montserrat-Light.ttf'),
      }),
    ]);
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <View>
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            onFinish={this._handleFinishLoading}
          />
        </View>
      );
    } else {
      return (
        <ApolloProvider client={client}>
          {this.state.loggedIn
          ? (
              <View style={{flex: 1}}>
                <AppNavigator screenProps={{ changeLoginState: this.handleChangeLoginState }} />
                <OrderStatus />
              </View>
            )
          : (
              <AuthNavigator screenProps={{ changeLoginState: this.handleChangeLoginState }} />
            )
          }
        </ApolloProvider>
      );
    }
  }
}
// TODO: GET CUSTOM FONT SETUP FOR STYLING AND FINISH USUALS STYLE
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
