import React from 'react';
import UsualsContainer from 'app/containers/Usuals';

class Usuals extends React.Component {
  static navigationOptions = {
    title: 'Usuals',
  };

  render() {
    return (
      <UsualsContainer {...this.props} />
    );
  }
}

export default Usuals;
