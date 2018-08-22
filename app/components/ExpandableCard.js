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
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class ExpandableCard extends React.Component {
  render() {
    const { title, actionTitle, onActionPress, subLabels } = this.props;
    
    return (
      <Card style={{flex: 1, width: screenWidth-20}}>
        <CardItem header>
          <Text>{title}</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Row>
              {subLabels.map((label, index) => {
                return <Col key={`${label}${index}`} size={1}><Text style={{textAlign: 'left'}} note key={`${label}${index}`} >{label}</Text></Col>}
              )}
            </Row>
          </Body>
        </CardItem>
        <CardItem>
          <Right>
            <Button transparent primary onPress={onActionPress}>
              <Text>{actionTitle}</Text>
            </Button>
          </Right>
        </CardItem>
      </Card>
    );
  }

}

export default ExpandableCard;
