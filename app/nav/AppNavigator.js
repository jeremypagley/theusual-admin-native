import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Profile from 'app/scenes/Profile';
import Order from 'app/scenes/Order';
import Store from 'app/scenes/Store';
import Products from 'app/scenes/Products';
import Product from 'app/scenes/Product';
import Usuals from 'app/scenes/Usuals';

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
});

export default AppStack;
