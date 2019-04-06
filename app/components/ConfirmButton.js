import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Button, Text } from 'native-base';

class ConfirmButton extends Component {
  
  static propTypes = {
    confirmText: PropTypes.string,
    confirmButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    onPress: PropTypes.func
  }

  static defaultProps = {
    confirmText: 'Are you sure?',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  }

  render() {
    const { title } = this.props;
    return (
      <Button warning small {...this.props} onPress={this._handlePress}>
        <Text>{title}</Text>
      </Button>
    );
  }

  _handlePress = () => {

    const { confirmText, confirmButtonText, cancelButtonText, onPress } = this.props;

    Alert.alert(
      confirmText,
      undefined,
      [
        {text: confirmButtonText, onPress},
        {text: cancelButtonText, onPress: () => {}, style: 'cancel'},
      ]
    )

  }

}

export default ConfirmButton;
