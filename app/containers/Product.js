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
import OrderStatus from 'app/containers/OrderStatus';

import { Col, Row, Grid } from 'react-native-easy-grid';
import { Query, Mutation, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GET_ORDER from 'app/graphql/query/getOrder';

class Product extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addedModifiers: {}
    }
  }

  render() {
    const product = this.props.navigation.getParam('product', null);
    const modifiersArray = this.getModifiersDataArray(product.productModifiers);

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
              {this.getAddItemButton(product)}
            </Col>
          </Row>
        </Grid>

        <OrderStatus />
      </Container>
    );
  }

  getAddItemButton = (product) => {
    const productModifiersOptions = this.getOrderItemMappedData();
    const productId = product._id;
    const storeId = product.store._id;
    
    return (
      <Mutation 
        mutation={CREATE_ORDER_ITEM}
        refetchQueries={() => {
          return [{
             query: GET_ORDER,
          }];
        }}
      >
         {createOrderItem => (
            <Button 
              transparent 
              block 
              primary 
              onPress={() => createOrderItem({variables: {productId, productModifiersOptions, storeId}})}
            >
            <Text>Add item</Text>
          </Button>
        )}
      </Mutation>
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

    // Doing this to remove __typename from options
    const opt = Object.assign({}, {title: option.title, price: option.price});
    addedModifiers[modifier._id].push(opt);

    this.setState({ addedModifiers: addedModifiers });
  }

  getOrderItemMappedData = (productId) => {
    const { addedModifiers } = this.state;
    let productModifiersOptions = [];

    Object.keys(addedModifiers).forEach(id => {
      const modifier = addedModifiers[id];
      productModifiersOptions.push(...modifier)
    });

    return productModifiersOptions;
  }

  getModifiersDataArray = (modifiers) => {
    return modifiers.map(modifier => {
      return {title: modifier.title, modifier: modifier}
    })
  }

}

const CREATE_ORDER_ITEM = gql`
  mutation createOrderItem($productId: String!, $productModifiersOptions: [ModifierOptionInput], $storeId: String!) {
    createOrderItem(productId: $productId, productModifiersOptions: $productModifiersOptions, storeId: $storeId) {
      _id,
      product {
        _id,
      }
      productModifiersOptions {
        title,
        price
      }
    }
  }
`;

// const WrappedComponent = graphql(CREATE_ORDER_ITEM, {
//   props: ({ mutate }) => ({
//     createOrderItem: (data) => mutate({ variables: { productId: data._id, productModifiersOptions: data.productModifiersOptions } }),
//   }),
// })(Product);

export default Product;
