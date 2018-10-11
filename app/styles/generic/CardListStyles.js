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
    borderBottomColor: Colors.Grey,
  },

  cardItemSelected: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.BrandGreen
  },

  itemBody: {
    alignItems: 'center',
  },

  cardItemTitleSelected: {
    color: Colors.BrandGreen,
  },

  cardItemIconSelected: {
    color: Colors.BrandGreen,
  },

  cardItemTitle: {
    paddingBottom: 6
  },

  cardItemTitleColor: {
    paddingBottom: 6,
    color: Colors.BrandGreen,
    textAlign: 'center',
    fontSize: 28,
  },

  cardItemSubTitle: {
    color: Colors.LightGrey,
    fontSize: 20,
    textAlign: 'center'
  },

  cardItemIconTitle: {
    paddingLeft: 8   
  },
});

export default Styles;
