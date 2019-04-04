import React from 'react';
import MenuContainer from 'app/containers/Menu';

class Menu extends React.Component {
  static navigationOptions = {
    title: 'Menu',
  };

  render() {
    return (
      <MenuContainer {...this.props} />
    );
  }
}

export default Menu;
