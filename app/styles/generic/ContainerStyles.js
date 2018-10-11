import { StyleSheet } from 'react-native';
import Colors from 'app/styles/Colors';

const Styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BrandLightGrey,
  },

  header: {
    backgroundColor: Colors.BrandRed,
    paddingTop: 0,
    // borderWidth: 0,
    // borderTopWidth: 0,
    // borderBottomWidth: 0,
    // shadowOpacity: 0,
  },

  content: {
    marginTop: -70
  },

  tab: {
    backgroundColor: Colors.BrandRed,
  },

  activeTab: {
    backgroundColor: Colors.BrandRed,
  },

  tabText: {
    color: Colors.White,
    fontFamily: 'montserrat-medium'
  },

  activeTabText: {
    color: Colors.White,
    fontFamily: 'montserrat-bold'
  },

  tabBarUnderline: {
    backgroundColor: Colors.White
  },

  innerContainer: {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default Styles;
