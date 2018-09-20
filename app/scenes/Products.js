import React from 'react';
import ProductsContainer from 'app/containers/Products';

class Products extends React.Component {
  render() {
    return (
        <ProductsContainer {...this.props} />
    );
  }
}

export default Products;
