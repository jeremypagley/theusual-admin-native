import React from 'react';
import { 
  Container,
  Text,
  Title,
  Header,
  Body,
  H2,
  Left,
  Right,
  View,
  Card, 
  CardItem,
  Content,
  Button
} from 'native-base';
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
    }))
  }

  render() {
    const {
      title,
      actionTitle,
      onActionPress,
      items
    } = this.props;
    
    return (
      <Card>
        <CardItem header>
          <Text note>{title}</Text>
        </CardItem>

        {items.map((item, index) => {
          return (
            <CardItem key={item.title}>
              <Body>
                <Row>
                  <H2>{item.title}</H2>
                </Row>
                <Row>
                  {this.getItemOptions(item.options)}
                </Row>
              </Body>
            </CardItem>
          )
        })}

        <CardItem>
          <Body style={{alignItems: 'flex-end'}}>
            <Right>
              <Button transparent primary onPress={onActionPress}>
                <Text>{actionTitle}</Text>
              </Button>
            </Right>
          </Body>
        </CardItem>
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
