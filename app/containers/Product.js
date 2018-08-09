import React from 'react';
import { 
  Container,
  Title,
  H1,
  Header,
  Content,
  Body,
  ListItem,
  Button,
  Accordion,
  Right,
  Left,
  View,
  Text
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { Col, Row, Grid } from 'react-native-easy-grid';
import { FlatList } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

class Product extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addedModifiers: {}
    }
  }

  render() {
    const product = this.props.navigation.getParam('product', null);
    const modifiersArray = this._getModifiersDataArray(product.productModifiers);

    return (
      <Container>
        <Header>
          <Body>
            <H1>{product.title}</H1>
          </Body>
        </Header>

        <Grid>
          <Row size={10}>
            <Text note>{product.description}</Text>
          </Row>
          <Row size={80}>
            <Col>
              <Accordion
                dataArray={modifiersArray}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
              />
            </Col>
          </Row>
          <Row size={10}>
            <Col>
              <Button transparent block primary>
                <Text>Add item</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }

  _renderHeader = (item, expanded) => {
    return (
      <View style={{ flexDirection: "row", padding: 10, backgroundColor: "#F6F6F6", borderBottomWidth: 2, borderBottomColor: 'lightgrey' }}>
        <Left>
          <Text style={{ fontWeight: "600" }}>
            {" "}{item.title}
          </Text>
      
          {this.getAddedModifiersOptions(item.modifier)}
        </Left>

        {expanded
          ? <Ionicons name="ios-arrow-up" size={28} color="black" />
          : <Ionicons name="ios-arrow-down" size={28} color="black" />}
      </View>
    );
  }

  _renderContent = (item) => {
    const modifier = item.modifier;
    const options = modifier.options;

    return (
      <View>
        {options.map(option => {
          return (
            <ListItem key={option.title} icon onPress={() => this.onModifierOptionPress(option, modifier)}>
              <Body>
                <Text>{option.title}</Text>
              </Body>
              <Right>
                <Ionicons name="ios-add" size={28} color="black" />
              </Right>
            </ListItem>
          )
        })}
      </View>
    );
  }

  getAddedModifiersOptions = (modifier) => {
    const { addedModifiers } = this.state;
    const addedModifiersIds = Object.keys(addedModifiers);

    return addedModifiersIds.map(id => {
      const options = modifier._id === id ? addedModifiers[id] : null;
      return options ? this.getAddedModifierOptions(options, id) : null;
    });
  }

  getAddedModifierOptions = (options, id) => {
    return options.map((option, index) => <Text key={`${index}${id}`} style={{paddingTop: 5}}>+ {option.title}</Text>);
  }

  onModifierOptionPress = (option, modifier) => {
    let { addedModifiers } = this.state;
    addedModifiers[modifier._id] = addedModifiers[modifier._id] ? addedModifiers[modifier._id] : [];
    addedModifiers[modifier._id].push(option);

    this.setState({ addedModifiers: addedModifiers });
  }

  _getModifiersDataArray = (modifiers) => {
    return modifiers.map(modifier => {
      return {title: modifier.title, modifier: modifier}
    })
  }

}

// const StoresQuery = gql`
// {
//   stores {
//     _id,
//     title,
//     description,
//     hours,
//     phone,
//     website,
//     location {
//       address
//     },
//     productCategories {
//       title,
//       products
//     }
//   }
// }
// `

export default Product;
