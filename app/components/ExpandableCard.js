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
  Button
} from 'native-base';
import { EvilIcons } from '@expo/vector-icons';
import { Row } from 'react-native-easy-grid';
import ExpandableCardStyles from 'app/styles/ExpandableCardStyles';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
const screenWidth = Dimensions.get('window').width;

class ExpandableCard extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string)
    })),
    onActionPress: PropTypes.func,
    removable: PropTypes.bool,
    removableOnPress: PropTypes.func
  }

  render() {
    const {
      title,
      actionTitle,
      onActionPress,
      removableOnPress,
      removable,
      items
    } = this.props;
    
    return (
      <Card>
        {title && removable ? 
        <CardItem header>
          <Left>
            <Text note>{title}</Text>
          </Left>
          {removable ?
          <Right>
            <Button
              iconRight 
              transparent 
              onPress={removableOnPress}
            >
              <EvilIcons name="close" size={35} color="grey" />
            </Button>
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
                    <H2>{item.title}</H2>
                  </Row>
                  <Row>
                    {this.getItemOptions(item.options)}
                  </Row>
                </Body>
              </Left>
              <Right>
                {removable && !title && index === 0 ? 
                <Button
                  iconRight 
                  transparent 
                  onPress={removableOnPress}
                  block
                  style={{alignSelf: 'flex-end'}}
                >
                  <EvilIcons name="close" size={35} color="grey" />
                </Button>
                : null}
              </Right>
            </CardItem>
          )
        })}

        {onActionPress && actionTitle ? 
        <CardItem>
          <Body>
            <Button
              block 
              transparent 
              primary
              large
              onPress={onActionPress}
            >
              <Text>{actionTitle}</Text>
            </Button>
          </Body>
        </CardItem>
        : null}
      </Card>
    );
  }

  getItemOptions = (options) => {
    return options.map((option, index) => {
      return (
        <View
          style={ExpandableCardStyles.optionWrapper}
          key={`${option}${index}`}
        >
          <Text note>{option}</Text>
        </View>
      )
    })
  }

}

export default ExpandableCard;
