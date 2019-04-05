import React from 'react';
import EditableCategoryContainer from 'app/containers/EditableCategory';

class EditableCategory extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      // title: navigation.getParam('productCategory', 'Product Category').title
      title: 'Edit Category'

    }
  };

  render() {
    return (
      <EditableCategoryContainer {...this.props} />
    );
  }
}

export default EditableCategory;
