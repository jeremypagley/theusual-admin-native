import React from 'react';
import EditableModifierContainer from 'app/containers/EditableModifier';

class EditableModifier extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('modifier', 'Modifier').title
    }
  };

  render() {
    return (
      <EditableModifierContainer {...this.props} />
    );
  }
}

export default EditableModifier;
