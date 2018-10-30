import { createStackNavigator } from 'react-navigation';

import Register from 'app/scenes/Register';
import Login from 'app/scenes/Login';
import Colors from 'app/styles/Colors';

const reusableNavOptions = {
  navigationOptions: ({ navigation }) => ({
    headerLeft: null,
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

const AuthStack = createStackNavigator({
  Login: { screen: Login, navigationOptions: { headerTitle: 'Login' } },
  Register: { screen: Register, navigationOptions: { headerTitle: 'Register' } },
}, reusableNavOptions);

export default AuthStack;
