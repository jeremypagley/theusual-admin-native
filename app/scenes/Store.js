import React from 'react';
import StoreContainer from 'app/containers/Store';

class Store extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('storeTitle', 'Store');
    return {
      title
    };
  };

  render() {
    return (
      <StoreContainer {...this.props} />
    );
  }
}

export default Store;
