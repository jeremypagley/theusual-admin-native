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
  H1,
  H3
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, ScrollView, Dimensions } from 'react-native';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import ExpandableCard from 'app/components/ExpandableCard';
import ContainerStyles from 'app/styles/generic/ContainerStyles';

console.ignoredYellowBox = ['Remote debugger'];

class UsualsContainer extends React.Component {

  render() {
    const { currentUser } = this.props.data;
    if (!currentUser) return null;

    return (
      <Container style={ContainerStyles.container}>
        <Header>
          <Body>
            <H1>Usuals</H1>
          </Body>
        </Header>

        <ScrollView style={ContainerStyles.innerContainer}>
          <Mutation mutation={ADD_ORDER_BY_ID}>
            {(addOrderById, { data }) => {
              return currentUser.usuals.map(usual => {
                return this.getUsualCard(usual);
              })
            }}
          </Mutation>
        </ScrollView>
      </Container>
    );
  }

  getUsualCard = (usual) => {
    const usualItems = usual.items;

    const items = usualItems.map(item => {
      const options = this.getUsualOptions(item);      
      return {title: item.product.title, options: options}
    });

    return (
      <View key={usual._id}>
        <ExpandableCard 
          title={usual.store.location.address}
          actionTitle="Add order"
          items={items}
        />
      </View>
    )
  }

  getUsualOptions = (item) => {
    let options = [];
    const combinedPrice = this.getCombinedPrices(item);

    item.productModifiersOptions.forEach(mod => {
      options.push(mod.title)
    });

    options.push(`$${combinedPrice}`);

    return options
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
        _id,
        email,
        order,
        usuals {
          _id,
          items {
            _id,
            product {
              _id,
              title,
              description,
              price,
            }
            productModifiersOptions {
              title,
              price
            }
          }
          store {
            _id,
            title,
            location {
              longitude,
              latitude,
              address
            }
          }
        }
      }
    }
  `
)(UsualsContainer);
