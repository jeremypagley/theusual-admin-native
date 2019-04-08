import React from 'react';
import EditableStoreContainer from 'app/containers/EditableStore';

class EditableStore extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      // title: navigation.getParam('productCategory', 'Product Category').title
      title: 'Edit Category'

    }
  };

  render() {
    return (
      <EditableStoreContainer {...this.props} />
    );
  }
}

export default EditableStore;
