import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Cart from 'app/scenes/Profile';
import Settings from 'app/scenes/Profile';
import Order from 'app/scenes/Order';
import Store from 'app/scenes/Store';
import Products from 'app/scenes/Products';
import Product from 'app/scenes/Product';
import Usuals from 'app/scenes/Usuals';
import { Icon } from 'native-base';

import Colors from 'app/styles/Colors';

import React from 'react';
import { Text } from 'native-base';

const UsualsStack = createStackNavigator({
  Usuals: { screen: Usuals },
});

const StoresStack = createStackNavigator({
  Order: { screen: Order },
  Store: { screen: Store },
  Products: { screen: Products },
  Product: { screen: Product },
});

const AppStack = createBottomTabNavigator({
  Usuals: UsualsStack,
  Stores: StoresStack,
  Cart: Cart,
  Settings: Settings,
},
{
  headerMode: 'float',
  navigationOptions: ({ navigation }) => ({
    tabBarOptions: {
      activeTintColor: Colors.BrandRed,
      inactiveTintColor: Colors.BrandBlueGrey,
      showLabel: false
    },
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Usuals') {
        iconName = 'md-cafe';
      } else if (routeName === 'Stores') {
        iconName = 'md-search';
      } else if (routeName === 'Cart') {
        iconName = 'md-cart';
      } else if (routeName === 'Settings') {
        iconName = 'md-menu';
      }

      const color = focused ? Colors.BrandRed : Colors.BrandBlueGrey;

      return (
        <Icon
          name={iconName}
          size={22}
          style={{ marginBottom: -3, color }}
          active={focused}
        />
      )
    },
    
  }),
});

export default AppStack;
