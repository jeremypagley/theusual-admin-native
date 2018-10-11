import React from 'react';
import ProductContainer from 'app/containers/Product';

class Product extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('product', 'Item').title,
    };
  };

  render() {
    return (
      <ProductContainer {...this.props} />
    );
  }
}

export default Product;
