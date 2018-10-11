import React from 'react';
import OrderStatusContainer from 'app/containers/OrderStatus';

class Cart extends React.Component {
  static navigationOptions = {
    title: 'Cart',
  };

  render() {
    return (
      <OrderStatusContainer {...this.props} />
    );
  }
}

export default Cart;
