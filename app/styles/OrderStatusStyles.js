import { StyleSheet, Dimensions } from 'react-native';
import Colors from 'app/styles/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    bottom: 0,
    // justifyContent: "center",
    alignSelf: "center",
    width: screenWidth,
    height: screenHeight-80
  },
  actionBtnWrapper: {
    alignSelf: 'center',
    paddingTop: 20
  },
  // button: {
  //   backgroundColor: "lightblue",
  //   padding: 12,
  //   margin: 16,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderRadius: 4,
  //   borderColor: "rgba(0, 0, 0, 0.1)"
  // },
  modalContent: {
    backgroundColor: "white",
    height: screenHeight-80,
    marginTop: 80,
    width: screenWidth,
    // justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  // scrollableModal: {
  //   height: 300
  // },
  // scrollableModalContent1: {
  //   height: 200,
  //   backgroundColor: "orange",
  //   alignItems: "center",
  //   justifyContent: "center"
  // },
  // scrollableModalContent2: {
  //   height: 200,
  //   backgroundColor: "lightgreen",
  //   alignItems: "center",
  //   justifyContent: "center"
  // }
});

export default Styles;