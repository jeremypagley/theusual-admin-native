import { StyleSheet } from 'react-native';
import Colors from 'app/styles/Colors';

const Styles = StyleSheet.create({
  h1: {
    fontSize: 27,
    lineHeight: 32,
    color: Colors.BrandBlack,
    fontFamily: 'montserrat-regular'
  },
  h2: {
    fontSize: 24,
    lineHeight: 27,
    color: Colors.BrandBlack,
    fontFamily: 'montserrat-regular'
  },
  h3: {
    fontSize: 21,
    lineHeight: 22,
    color: Colors.BrandBlack,
    fontFamily: 'montserrat-regular'
  },
  semiBoldH2: {
    fontSize: 24,
    lineHeight: 27,
    color: Colors.BrandBlack,
    fontFamily: 'montserrat-semibold'
  },

  error: {
    fontSize: 16,
    color: Colors.BrandRed,
    fontFamily: 'montserrat-semibold'
  },

  noDataSemiBold: {
    fontSize: 14,
    color: Colors.BrandDarkGrey,
    fontFamily: 'montserrat-semibold'
  },

  note: {
    fontSize: 16,
    color: Colors.BrandDarkGrey,
    fontFamily: 'montserrat-regular'
  },
  noteBold: {
    fontSize: 16,
    color: Colors.BrandDarkGrey,
    fontFamily: 'montserrat-bold'
  },
  noteTitle: {
    fontSize: 14,
    color: Colors.BrandDarkGrey,
    fontFamily: 'montserrat-bold'
  },
  noteListItem: {
    fontSize: 14,
    color: Colors.BrandDarkGrey,
    fontFamily: 'montserrat-regular'
  },
  
  noteEmphasize: {
    fontSize: 28,
    color: Colors.BrandRed,
    fontFamily: 'montserrat-regular'
  },

  listTitle: {
    fontSize: 20,
    color: Colors.BrandBlack,
    fontFamily: 'montserrat-bold'
  },
  listItemTitle: {
    fontSize: 20,
    color: Colors.BrandBlack,
    fontFamily: 'montserrat-medium',
    paddingBottom: 5
  },
  listSubItemTitle: {
    fontSize: 16,
    color: Colors.BrandBlack,
    fontFamily: 'montserrat-regular',
  },
  listSubItemTitleSelected: {
    fontSize: 16,
    color: Colors.BrandRed,
    fontFamily: 'montserrat-bold',
  },
  listItemTitleTextAction: {
    color: Colors.BrandDarkGrey,
    fontSize: 16,
    fontFamily: 'montserrat-medium',
    paddingRight: 20,
  },

  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontFamily: 'montserrat-medium',
  },
  buttonPrimaryText: {
    color: Colors.BrandRed,
    fontSize: 16,
    fontFamily: 'montserrat-medium',
  },


  headerTitle: {
    fontSize: 16,
    color: Colors.White,
    fontFamily: 'montserrat-bold',
    textAlign: 'center',
    marginLeft: 20,
  },
});

export default Styles;
