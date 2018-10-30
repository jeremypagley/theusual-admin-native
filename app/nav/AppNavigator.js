import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { DeviceEventEmitter } from 'react-native';

import Cart from 'app/scenes/Cart';
import Settings from 'app/scenes/Profile';
import Order from 'app/scenes/Order';
import Store from 'app/scenes/Store';
import Products from 'app/scenes/Products';
import Product from 'app/scenes/Product';
import Usuals from 'app/scenes/Usuals';
import { Icon, Badge, View } from 'native-base';
import Colors from 'app/styles/Colors';

const reusableNavOptions = {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: Colors.BrandRed,
      borderBottomWidth: 0,
    },
    headerTintColor: Colors.White,
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'montserrat-bold'
    },
  })
}

const UsualsStack = createStackNavigator({
  Usuals: { screen: Usuals },
}, reusableNavOptions);

const CartStack = createStackNavigator({
  Cart: { screen: Cart },
}, reusableNavOptions);

const StoresStack = createStackNavigator({
  Order: { screen: Order },
  Store: { screen: Store },
  Products: { screen: Products },
  Product: { screen: Product },
}, reusableNavOptions);

const AppStack = createBottomTabNavigator({
  Usuals: UsualsStack,
  Stores: StoresStack,
  Cart: CartStack,
  Settings: Settings,
},
{
  headerMode: 'float',
  navigationOptions: ({ screenProps, navigation }) => ({
    headerStyle: {
      backgroundColor: Colors.BrandRed,
    },
    headerTintColor: Colors.White,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    tabBarOptions: {
      activeTintColor: Colors.BrandRed,
      inactiveTintColor: Colors.BrandBlueGrey,
      // showLabel: false
    },
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      const { activeOrder } = screenProps;
      
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

      if (activeOrder && iconName === 'md-cart') {
        return (
          <View>
            <Icon
              name={iconName}
              size={22}
              style={{ marginBottom: -3, color }}
              active={focused}
            />
            <Badge style={{
                position: 'absolute', 
                backgroundColor: Colors.BrandRed,
                height: 13,
                left: 16,
              }}
            >
            </Badge>
          </View>
        );
      }

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

class AppNav extends React.Component {

  render() {
    return (
      <AppStack {...this.props} />
    );
  }
}

export default AppNav;
