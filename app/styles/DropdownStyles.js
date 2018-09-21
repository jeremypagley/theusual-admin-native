import { StyleSheet, Dimensions } from 'react-native';
import Colors from 'app/styles/Colors';

const screenWidth = Dimensions.get('window').width;
const screenFullWidth = screenWidth-20;

const Styles = StyleSheet.create({
  dropdownContainer: {
    width: screenWidth,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGrey,
    paddingBottom: 5
  },

  dropdownText: {
    color: Colors.Black,
    fontSize: 18,
    paddingTop: 5,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 0
  },

  dropdownInner: {
    width: 322,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    marginTop: 5,
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  dropdownRow: {
    padding: 15,
    color: Colors.Black,
    fontSize: 18
  },

  dropdownSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGrey,
    height: 0,
    width: 322
  },

  display: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },

  displayColLeft: {
    alignSelf: 'flex-start',
    width: 100

  },

  displayCol: {
    flex: 1,
  },

  displayColRight: {
    alignSelf: 'flex-end',
    width: 100
  },
  
});

export default Styles;
