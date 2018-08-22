import React from 'react';
import { 
  Text,
  Button,
  Card,
  CardItem,
  Body,
  Right,
  Container,
  Header,
  H1
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, ScrollView } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import ExpandableCard from 'app/components/ExpandableCard';

class UsualsContainer extends React.Component {

  render() {
    const { currentUser } = this.props.data;
    console.log('this.props: ', this.props)

    if (!currentUser) return null;

    // TODO: not show view?

    return (
      <Container>
        <Header>
          <Body>
            <H1>Usuals</H1>
          </Body>
        </Header>

        <ScrollView>
          <Mutation mutation={ADD_ORDER_BY_ID}>
            {(addOrderById, { data }) => {
              return currentUser.usuals.map(usual => {
                return (
                  <Card style={{flex: 1, width: screenWidth-20}}>
                    <CardItem header>
                      <Text>{usual.store}</Text>
                    </CardItem>
                    <CardItem>
                      <Body>
                        {this.getOrderProducts(usual.items, usual._id)}
                      </Body>
                    </CardItem>
                    <CardItem>
                      <Right>
                        <Button
                          transparent 
                          primary 
                          block
                          // onPress={() => addOrderById({variables: {id: usualId}})}
                        >
                          <Text>Add order</Text>
                        </Button>
                      </Right>
                    </CardItem>
                  </Card>
                )
              })
            }}
          </Mutation>
        </ScrollView>
      </Container>
    );
  }

  getOrderProducts = (items, usualId, addOrderById) => {
    return items.map(item => {
      const combinedPrice = this.getCombinedPrices(item);
      let subLabels = [];

      item.productModifiersOptions.forEach(mod => {
        subLabels.push(mod.title)
      });

      subLabels.push(`$${combinedPrice}`);

      return (
        <View key={item._id}>
          <ExpandableCard 
            title={item.product.title}
            actionTitle="Add order"
            subLabels={subLabels}
          />
        </View>
      )
    });
  }

  getCombinedPrices = (item) => {
    let productPrice = item.product.price;
    let combinedPrice = productPrice;

    item.productModifiersOptions.forEach(mod => combinedPrice += mod.price);
    
    return Number.parseFloat(combinedPrice).toFixed(2);
  }

}

const ADD_ORDER_BY_ID = gql`
  mutation addOrderById($id: String!) {
    addOrderById(id: $id) {
      _id
    }
  }
`

export default graphql(
  gql`
    query User {
      currentUser {
        _id
        email
        order
        usuals {
          _id
          store
          items {
            _id
            productModifiersOptions {
              title
              price
            }
            product {
              _id
            }
          }
        }
      }
    }
  `
)(UsualsContainer);
