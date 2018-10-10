import React from 'react';
import StoreContainer from 'app/containers/Store';

class Store extends React.Component {
  static navigationOptions = {
    title: 'Stores',
  };

  render() {
    return (
      <StoreContainer {...this.props} />
    );
  }
}

export default Store;
