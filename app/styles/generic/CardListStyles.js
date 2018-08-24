import { StyleSheet } from 'react-native';
import Colors from 'app/styles/Colors';

const Styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 0
  },
  
  card: {
    marginLeft: 10,
    marginRight: 10
  },

  cardItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.Grey
  },

  cardItemTitle: {
    paddingBottom: 6
  },
});

export default Styles;
