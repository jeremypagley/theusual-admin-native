import { StyleSheet, Dimensions } from 'react-native';
import Colors from 'app/styles/Colors';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const marginTopOffset = 60;
const contentHeight = screenHeight-marginTopOffset;

const Styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BrandLightGrey,
  },

  header: {
    backgroundColor: Colors.BrandRed,
    paddingTop: 0,
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


  modalContainer: {
    flex: 1,
    position: 'relative',
    bottom: 0,
    alignSelf: "center",
    width: screenWidth,
    height: contentHeight
  },

  modalHeader: {
    backgroundColor: Colors.BrandRed,
    paddingTop: 0,
    borderTopRightRadius: 20, 
    borderTopLeftRadius: 20
  },


  modalContent: {
    backgroundColor: Colors.White,
    height: contentHeight,
    marginTop: marginTopOffset,
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },

  modalCloseIcon: {
    fontSize: 34,
    color: Colors.White
  }
});

export default Styles;
