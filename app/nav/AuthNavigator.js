import { createStackNavigator } from 'react-navigation';

import Register from 'app/scenes/Register';
import Login from 'app/scenes/Login';

const AuthStack = createStackNavigator({
  Register: { screen: Register, navigationOptions: { headerTitle: 'Register' } },
  Login: { screen: Login, navigationOptions: { headerTitle: 'Login' } },
},
{
  headerMode: 'none',
});

export default AuthStack;
