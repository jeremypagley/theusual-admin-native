import React from 'react';
import { 
  Text,
  Button,
  H1,
  H3,
  Fab,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, ScrollView } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';
import OrderStatusStyles from 'app/styles/OrderStatusStyles';
import Colors from 'app/styles/Colors';
import { Ionicons } from '@expo/vector-icons';
import ExpandableCard from 'app/components/ExpandableCard';
import GET_ORDER from 'app/graphql/query/getOrder';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import PaymentManager from 'app/containers/PaymentManager';
import CardForm from 'app/components/stripe/CardForm';

class OrderStatus extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      token: ''
    }
  }

  render() {
    let open = this.state.open;

    return (
      <Query query={GET_ORDER}>
        {({ loading, error, data }) => {
          if (error) return <View><Text>Error</Text></View>;
          let items = [];

          if (data.order && data.order.length > 0) {
            items = data.order[0].items;
          } else {
            items = [];
          }

          return (
            <View style={{position: "absolute", bottom: 80, right: -5}}>
              <Modal
                isVisible={open}
                onSwipe={() => this.setState({ open: false })}
                swipeDirection="down"
                style={OrderStatusStyles.container}
              >
                <View>{this.renderModalContent(items)}</View>
              </Modal>

              <Fab
                containerStyle={{ }}
                active={false}
                style={{ backgroundColor: Colors.Brand }}
                position="bottomRight"
                onPress={() => this.setState({ open: !this.state.open })}
              >
                <Text>{items.length}</Text>
                <Text>Items</Text>
              </Fab>
            </View>
          )
        }}
      </Query>
    );

  }

  renderModalContent = (items) => {
    const { currentUser } = this.props.data;
    if (!currentUser) return;

    const hasBilling = currentUser.billing;
    const noOrderItems = items.length < 1;
    
    return (
      <View style={OrderStatusStyles.modalContent}>
        <View style={OrderStatusStyles.closeIconWrapper}>
          <Ionicons name="ios-arrow-down" size={60} color="lightgrey" />
        </View>
        <H1 style={OrderStatusStyles.title}>Review Order</H1>
        <H3 style={OrderStatusStyles.title}>Current balance: TODO</H3>

        <ScrollView>
          {this.getOrderProducts(items, noOrderItems)}

          {!noOrderItems && hasBilling ?
          <View style={OrderStatusStyles.actionBtnWrapper}>
            <Mutation 
              mutation={CONFIRM_ORDER}
              refetchQueries={() => {
                return [{
                   query: GET_ORDER,
                }];
              }}
            >
              {confirmOrder => (
                <Button 
                  transparent 
                  block 
                  primary
                  large
                  style={OrderStatusStyles.actionBtn}
                  onPress={() => {
                    confirmOrder();
                    this.setState({ open: false });
                  }}
                >
                  <Text>Confirm order</Text>
                </Button>
              )}
            </Mutation>
          </View>
          : null}
          
          {!noOrderItems ?
          <View style={OrderStatusStyles.actionBtnWrapper}>
            <Mutation 
              mutation={CREATE_USUAL}
              refetchQueries={() => {
                return [{
                   query: GET_CURRENT_USER,
                }];
              }}
            >
              {createUsualByOrderId => (
                <Button 
                  transparent 
                  block 
                  primary
                  large
                  style={OrderStatusStyles.actionBtn}
                  onPress={() => createUsualByOrderId({variables: {id: currentUser.order}})}
                >
                  <Text>Add order to usuals</Text>
                </Button>
              )}
            </Mutation>
          </View>
          : null}

          <View style={OrderStatusStyles.actionBtnWrapper}>
            <PaymentManager />
          </View>
        </ScrollView>
      </View>
    );
  }

  getAddPayment = () => {
    return (
      <CardForm handleCardPayPress={token => this.setState({token: token})} />
    )
  }

  getOrderProducts = (items, noOrderItems) => {

    if (noOrderItems) return (
      <View style={OrderStatusStyles.noItemsWrapper}>
        <H3>No order items have been added 😕</H3>
      </View>
    )

    return items.map(item => {
      const combinedPrice = this.getCombinedPrices(item);
      let options = [];

      item.productModifiersOptions.forEach(mod => {
        options.push(mod.title)
      });

      options.push(`$${combinedPrice}`);

      return (
        <View key={item._id} style={OrderStatusStyles.cardWrapper}>
          <Mutation 
            mutation={REMOVE_ORDER_ITEM}
            refetchQueries={() => {
              return [{
                 query: GET_ORDER,
              }];
            }}
          >
            {(removeOrderItem, { data }) => (
              <ExpandableCard 
                items={[{title: item.product.title, options}]}
                removable
                removableOnPress={() => removeOrderItem({variables: {id: item._id}})}
              />
            )}
          </Mutation>
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

const REMOVE_ORDER_ITEM = gql`
  mutation removeOrderItem($id: String!) {
    removeOrderItem(id: $id) {
      _id
    }
  }
`

const CONFIRM_ORDER = gql`
  mutation confirmOrder {
    confirmOrder {
      _id
    }
  }
`

const CREATE_USUAL = gql`
  mutation createUsualByOrderId($id: String!) {
    createUsualByOrderId(id: $id) {
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
      }
    }
  `
)(OrderStatus);
