import { StyleSheet, Dimensions } from 'react-native';
import Colors from 'app/styles/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const marginTopOffset = 300;
const contentHeight = screenHeight-marginTopOffset;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    bottom: 0,
    // justifyContent: "center",
    alignSelf: "center",
    width: screenWidth,
    height: contentHeight
  },

  autoReload: {
    marginBottom: 10
  },

  dropdownContainer: { 
    flexDirection: 'row',
    margin: 5,
    height: 40
  },

  dropdownWrapper: { 
    flex: 1
  },

  listItemWrapper: {
    width: screenWidth-30
  },
  
  cardWrapper: {
    width: screenWidth-10
  },

  actionBtnWrapper: {
    alignSelf: 'center',
    marginTop: 10
  },

  actionBtn: {
    height: 40
  },

  actionBtnWrapperIcon: {
    alignSelf: 'flex-end',
    margin: 15
  },
  
  noItemsWrapper: {
    marginTop: 10
  },

  closeIconWrapper: {
    height: 45,
  },

  closeIconX: {
    color: 'lightgrey',
    fontSize: 36
  },

  title: {
    margin: 10,
    fontSize: 44,
    textAlign: 'center',
    color: Colors.Brand

  },

  subtitle: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 24,
    color: 'grey'
  },

  modalContent: {
    backgroundColor: "white",
    height: contentHeight,
    marginTop: marginTopOffset,
    width: screenWidth,
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
});

export default Styles;