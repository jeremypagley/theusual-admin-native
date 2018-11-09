import { StyleSheet, Dimensions } from 'react-native';
import Colors from 'app/styles/Colors';
const screenWidth = Dimensions.get('window').width;

const Styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    shadowColor: Colors.BrandShadow,
    shadowOffset: {width: 0, height: 3}, 
    shadowOpacity: 0.15, 
    shadowRadius: 12, 
    elevation: 8,
    borderRadius: 8,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    marginTop: 12
  },
  itemFooter: {
    paddingTop: 0,
    paddingBottom: 10
  },
  itemHeader: {
    paddingTop: 10,
    paddingBottom: 0
  },
  itemButtonTitle: {
    color: Colors.BrandRed,
    fontSize: 16,
    fontFamily: 'montserrat-bold'
  },

  cardStatusIndicator: {
    position: 'absolute', 
    bottom: 10, 
    right: 10,
    backgroundColor: 'transparent',
    paddingRight: 0,
    paddingBottom: 0,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  cardStatusText: {
    fontSize: 12,
    fontFamily: 'montserrat-bold',
    color: Colors.White,
  },

  accordionCardInner: {
    flexDirection: "row", 
    padding: 15, 
    backgroundColor: Colors.White,
    borderWidth: 0,
    borderBottomWidth: 1, 
    borderBottomColor: Colors.BrandGrey
  },


  cardListItemSelected: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.BrandRed
  },
});

export default Styles;