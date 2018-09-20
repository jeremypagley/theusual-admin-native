import React from 'react';
import ProductContainer from 'app/containers/Product';

class Product extends React.Component {
  render() {
    return (
      <ProductContainer {...this.props} />
    );
  }
}

export default Product;
