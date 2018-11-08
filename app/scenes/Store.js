import React from 'react';
import StoreContainer from 'app/containers/Store';

class Store extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = `Orders For: ${navigation.getParam('store', 'Store').title}`;
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
