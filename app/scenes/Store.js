import React from 'react';
import StoreContainer from 'app/containers/Store';
import { View, Text } from 'react-native';
import TypographyStyles from 'app/styles/generic/TypographyStyles';

class Store extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('storeTitle', 'Store');
    const address = navigation.getParam('storeAddress', 'Store');
    
    return {
      headerTitle: (
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <Text style={TypographyStyles.headerTitle}>{title}</Text>
          <Text style={TypographyStyles.headerTitle}>{address}</Text>
        </View>
      )
    };
  };

  render() {
    return (
      <StoreContainer {...this.props} />
    );
  }
}

export default Store;
