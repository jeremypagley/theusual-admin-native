import React from 'react';
import EditableProductContainer from 'app/containers/EditableProduct';

class EditableProduct extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('product', 'Product').title
    }
  };

  render() {
    return (
      <EditableProductContainer {...this.props} />
    );
  }
}

export default EditableProduct;
