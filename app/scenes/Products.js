import React from 'react';
import ProductsContainer from 'app/containers/Products';

class Products extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('productCategory', 'Product').title,
    };
  };
  
  render() {
    return (
      <ProductsContainer {...this.props} />
    );
  }
}

export default Products;
