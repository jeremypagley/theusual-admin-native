import React from 'react';
import ProductContainer from 'app/containers/Product';

class Product extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const backOverrideNode = navigation.getParam('backOverride', null);

    return {
      title: navigation.getParam('product', {title: 'Item'}).title,
      // headerLeft: backOverrideNode(navigation.goBack)
    }
  };

  render() {
    return (
      <ProductContainer {...this.props} />
    );
  }
}

export default Product;
