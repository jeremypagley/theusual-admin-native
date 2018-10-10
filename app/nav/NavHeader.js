import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
// import { Text } from 'native-base';

export default class NavHeader extends PureComponent {
  render() {
    // The header string is in children
    return (
      <Text style={{color: 'black'}}>{this.props.children}</Text>
    );
  }
}
