import { createStackNavigator } from 'react-navigation';

import Register from 'app/scenes/Register';
import Login from 'app/scenes/Login';
import Colors from 'app/styles/Colors';

const reusableNavOptions = {
  navigationOptions: ({ navigation }) => ({
    headerLeft: null,
    headerStyle: {
      backgroundColor: Colors.BrandLightGrey,
      borderBottomWidth: 0,
    },
    headerTintColor: Colors.BrandBlack,
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'montserrat-bold'
    },
  })
}

const AuthStack = createStackNavigator({
  Login: { screen: Login },
  Register: { screen: Register, navigationOptions: { headerTitle: 'Register' } },
}, reusableNavOptions);

export default AuthStack;
