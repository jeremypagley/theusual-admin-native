import React from 'react';
import { 
  Text,
  Body,
  H2,
  Left,
  Right,
  View,
  Card, 
  CardItem,
  Icon
} from 'native-base';
import { Row } from 'react-native-easy-grid';
import ExpandableCardStyles from 'app/styles/ExpandableCardStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import PropTypes from 'prop-types';
import Colors from 'app/styles/Colors';
import CardList from 'app/components/CardList';

class ExpandableCard extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string)
    })),
    onActionPress: PropTypes.func,
    removable: PropTypes.bool,
    removableOnPress: PropTypes.func,
    keyId: PropTypes.string
  }

  render() {
    const {
      title,
      actionTitle,
      onActionPress,
      removableOnPress,
      removable,
      items,
    } = this.props;
    
    return (
      <View style={CardStyles.card}>
        <Card transparent>
          {title && removable ? 
          <CardItem header style={CardStyles.itemHeader}>
            <Left>
              <Text style={TypographyStyles.noteTitle}>{title}</Text>
            </Left>
            {removable ?
            <Right>
              <Icon name="md-close" style={{fontSize: 30, color: Colors.BrandGrey}} onPress={removableOnPress} />
            </Right>
            : null}
          </CardItem>
          : null}

          {items.map((item, index) => {
            return (
              <CardItem key={item.title}>
                <Left>
                  <Body>
                    <Row>
                      <H2 style={TypographyStyles.semiBoldH2}>{item.title}</H2>
                    </Row>
                    <Row>
                      {this.getItemOptions(item.options)}
                    </Row>
                  </Body>
                </Left>
                <Right>
                  {removable && !title && index === 0 ? 
                    <Icon name="md-close" style={{fontSize: 30, color: Colors.BrandGrey}} onPress={removableOnPress} />
                  : null}
                </Right>
              </CardItem>
            )
          })}

          {onActionPress && actionTitle ? 
          <CardItem footer button onPress={onActionPress} style={CardStyles.itemFooter}>
            <Left />
            <Right>
              <Text style={CardStyles.itemButtonTitle}>{actionTitle}</Text>
            </Right>
          </CardItem>
          : null}
        </Card>
      </View>
    );
  }

  getItemOptions = (options) => {
    return options.map((option, index) => {
      return (
        <View
          style={ExpandableCardStyles.optionWrapper}
          key={`${option}${index}`}
        >
          <Text style={TypographyStyles.note}>{option}</Text>
        </View>
      )
    });
  }

}

export default ExpandableCard;
