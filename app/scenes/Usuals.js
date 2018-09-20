import React from 'react';
import UsualsContainer from 'app/containers/Usuals';

class Usuals extends React.Component {
  render() {
    return (
      <UsualsContainer {...this.props} />
    );
  }
}

export default Usuals;
