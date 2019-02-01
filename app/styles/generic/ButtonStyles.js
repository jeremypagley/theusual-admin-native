import { StyleSheet } from 'react-native';
import Colors from 'app/styles/Colors';

const Styles = StyleSheet.create({
  secondaryButton: {
    backgroundColor: Colors.BrandSecondaryBlue,
    borderRadius: 8,
    marginTop: 12,
    height: 62
  },
  secondaryButtonText: {
    fontSize: 16,
    color: Colors.White,
    fontFamily: 'montserrat-medium',
  }
});

export default Styles;
