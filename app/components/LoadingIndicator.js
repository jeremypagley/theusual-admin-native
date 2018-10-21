import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  CardItem,
  Left,
  Text,
  View
} from 'native-base';
import PropTypes from 'prop-types';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';

export default class LoadingIndicator extends PureComponent {
  static propTypes = {
    message: PropTypes.string.isRequired,
  };

  static defaultProps = {
    message: 'Loading...',
  };

  render() {
    let { title } = this.props;

    return (
      <View style={CardStyles.card}>
        <Card transparent>
          {title
            ? <CardItem header style={CardStyles.itemHeader}>
                <Left>
                  <Text style={TypographyStyles.listTitle}>{title}</Text>
                </Left>
              </CardItem>
            : null}

          <View style={{margin: 15, alignSelf: 'center'}}>
            <ActivityIndicator size="large" color={Colors.BrandRed} />
          </View>
        </Card>
      </View>
    );
  }
}
