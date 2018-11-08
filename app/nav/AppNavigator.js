import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Cart from 'app/scenes/Cart';
import Profile from 'app/scenes/Profile';
import Order from 'app/scenes/Order';
import Store from 'app/scenes/Store';
import Products from 'app/scenes/Products';
import Product from 'app/scenes/Product';
import Activity from 'app/scenes/Activity';
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

const ActivityStack = createStackNavigator({
  Activity: { screen: Activity },
}, reusableNavOptions);

const CartStack = createStackNavigator({
  Cart: { screen: Cart },
}, reusableNavOptions);

const ProfileStack = createStackNavigator({
  Profile: { screen: Profile },
}, reusableNavOptions);

const StoresStack = createStackNavigator({
  Order: { screen: Order },
  Store: { screen: Store },
  Products: { screen: Products },
  Product: { screen: Product },
}, reusableNavOptions);

const AppStack = createBottomTabNavigator({
  Stores: StoresStack,
  // Activity: ActivityStack,
  // Cart: CartStack,
  // Profile: ProfileStack,
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
      if (routeName === 'Activity') {
        iconName = 'md-phone-portrait';
      } else if (routeName === 'Stores') {
        iconName = 'map-marker';
      } 
      // else if (routeName === 'Cart') {
      //   iconName = 'md-cart';
      // } else if (routeName === 'Profile') {
      //   iconName = 'md-menu';
      // }

      const color = focused ? Colors.BrandRed : Colors.BrandBlueGrey;

      if (activeOrder && routeName === 'Activity') {
        return (
          <View>
            <Icon
              name={iconName}
              size={22}
              style={{ marginBottom: -3, color }}
              active={focused}
              type="FontAwesome"
            />
            <Badge style={{
                position: 'absolute', 
                backgroundColor: Colors.BrandRed,
                height: 12,
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
          type="FontAwesome"
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
