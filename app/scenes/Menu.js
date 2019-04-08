import React from 'react';
import MenuContainer from 'app/containers/Menu';
import {Text} from 'react-native'

class Menu extends React.Component {
  static navigationOptions = {
    title: 'Edit Menu',
  };

  render() {
    return (
      <MenuContainer {...this.props} />
    );
  }
}

export default Menu;
