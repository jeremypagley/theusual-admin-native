import { StyleSheet } from 'react-native';
import Colors from 'app/styles/Colors';

const Styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 0
  },
  
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },

  cardItem: {
    height: 42,
    paddingTop: 1,
    paddingLeft: 0
  },

  form: {
    alignSelf: 'stretch'
  },

  formItem: {
    borderBottomWidth: 0,
    marginTop: -17
  },

  formItemLabel: {
    fontSize: 20
  },

  formInput: {
    paddingTop: 15
  },
});

export default Styles;
