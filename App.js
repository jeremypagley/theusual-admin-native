import React, { Component } from 'react';

import { signIn, signOut, getToken } from './util';
import AppNavigator from 'app/nav/AppNavigator';
import AuthNavigator from 'app/nav/AuthNavigator';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { Font, Icon, AppLoading } from 'expo';
import { Content, Spinner, Container, H2, View } from 'native-base';
import Colors from './app/styles/Colors';
import TypographyStyles from './app/styles/generic/TypographyStyles';
import DeviceEmitters from './app/utils/deviceEmitters';
import { AsyncStorage } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

console.ignoredYellowBox = ['Remote debugger'];

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });
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

const slides = [
  {
    key: 'slide1',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    // image: require('./assets/1.jpg'),
    // imageStyle: styles.image,
    backgroundColor: Colors.BrandRed,
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Other cool stuff',
    // image: require('./assets/2.jpg'),
    // imageStyle: styles.image,
    backgroundColor: Colors.BrandRed,
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    // image: require('./assets/3.jpg'),
    // imageStyle: styles.image,
    backgroundColor: Colors.BrandRed,
  }
];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      isLoadingComplete: false,
      activeOrder: false,
      firstLaunch: null
    };
  }

  async componentWillMount() {
    const token = await getToken();
    if (token) {
      this.setState({ loggedIn: true });
    }
  }

  componentDidMount(nextProps) {
    DeviceEmitters.activeOrderEventListen((activeOrder) => this._handleDeviceEmit(activeOrder));

    AsyncStorage.getItem("firstLaunch").then(value => {
      if (value === null) {
        AsyncStorage.setItem('firstLaunch', 'true');
        this.setState({firstLaunch: true});
      } else {
        this.setState({firstLaunch: false});
      }});
  }

  _handleDeviceEmit = (activeOrder) => {
    this.setState({ activeOrder });
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

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ firstLaunch: false, isLoadingComplete: false });
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
    }

    // if (this.state.firstLaunch === null){
    //   return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user.
    // } else if(this.state.firstLaunch == true){
    //   return <AppIntroSlider slides={slides} onDone={this._onDone}/>;
    // }

    return (
      <ApolloProvider client={client}>
        {this.state.loggedIn
        ? (
            <View style={{flex: 1}}>
              <AppNavigator screenProps={{ activeOrder: this.state.activeOrder, changeLoginState: this.handleChangeLoginState }} />
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
