import React, { PureComponent } from 'react';
import {
  Text,
  Button,
  Spinner
} from 'native-base';
import { LinearGradient } from 'expo';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
// background-image: linear-gradient(-90deg, #FE726B 0%, #FD5479 100%);

export default class GradientButton extends PureComponent {
  render() {
    const { buttonProps, title, disabled, loading } = this.props;
    const colors = disabled ? [Colors.BrandGrey, Colors.BrandGrey] : [Colors.BrandGradientStart, Colors.BrandGradientEnd];
    const spinner = loading ? <Spinner color="white" /> : null;

    return (
      <LinearGradient
        colors={colors}
        start={[0, 1]} 
        end={[1, 0]}
        style={{ padding: 8, alignItems: 'center', borderRadius: 8, marginTop: 12 }}
      >
        <Button 
          transparent
          block
          disabled={disabled}
          {...buttonProps}
        >
          {spinner}
          <Text
            style={TypographyStyles.buttonText}
          >
            {title}
          </Text>
        </Button>
      </LinearGradient>
    );
  }
}
