import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Profile from 'app/scenes/Profile';
import Order from 'app/scenes/Order';
import Store from 'app/scenes/Store';
import Products from 'app/scenes/Products';
import Product from 'app/scenes/Product';
import Usuals from 'app/scenes/Usuals';
import { Entypo } from '@expo/vector-icons';

import React from 'react';
import { Text } from 'native-base';

const HomeStack = createStackNavigator({
  Usuals: { screen: Usuals },
},
{
  headerMode: 'none',
});

const OrderStack = createStackNavigator({
  Order: { screen: Order },
  Store: { screen: Store },
  Products: { screen: Products },
  Product: { screen: Product },
},
{
  headerMode: 'none',
});

const AppStack = createBottomTabNavigator({
  Home: HomeStack,
  Order: OrderStack,
  Profile: Profile,
},
{
  headerMode: 'none',
  tabBarOptions: {
    // showLabel: false
  },
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Home') {
        iconName = 'home';
      } else if (routeName === 'Order') {
        // iconName = `ios-options${focused ? '' : '-outline'}`;
        iconName = 'shopping-bag';
      } else if (routeName === 'Profile') {
        iconName = 'user';
      }

      return <Entypo name={iconName} size={25} color={tintColor} />;
    },
    
  }),
});

export default AppStack;
