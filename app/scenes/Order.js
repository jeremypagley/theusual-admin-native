import React from 'react';
import OrderContainer from 'app/containers/Order';

class Order extends React.Component {
  static navigationOptions = {
    title: 'Stores',
  };

  render() {
    return (
      <OrderContainer {...this.props} />
    );
  }
}

export default Order;
