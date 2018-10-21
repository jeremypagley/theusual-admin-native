import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import TypographyStyles from 'app/styles/generic/TypographyStyles';

export default class GenericError extends PureComponent {
  static propTypes = {
    message: PropTypes.string.isRequired,
  };

  static defaultProps = {
    message: 'Looks like something went wrong...',
  };

  // handleRetryPress = event => {
  //   const { loading, disabled, onPress } = this.props;

  //   if (loading || disabled) {
  //     return;
  //   }

  //   if (onPress) {
  //     onPress(event);
  //   }
  // };

  render() {
    let { message } = this.props;
    const regex = /GraphQL error: /gi;

    return (
      <Text style={[TypographyStyles.error, {marginTop: 10, marginBottom: 10}]}>{message.replace(regex, '')}</Text>
    );
  }
}
