import React from 'react';
import { 
  Text,
  Button,
  H1,
  Fab
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, ScrollView, Dimensions } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';
import ContainerStyles from 'app/styles/generic/ContainerStyles.js'
import OrderStatusStyles from 'app/styles/OrderStatusStyles.js'
import { Ionicons } from '@expo/vector-icons';
import ExpandableCard from 'app/components/ExpandableCard';
import GET_ORDER from 'app/graphql/query/getOrder';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';

const screenWidth = Dimensions.get('window').width;

class OrderStatus extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false
    }
  }

  render() {
    let open = this.state.open;

    return (
      <Query query={GET_ORDER}>
        {({ loading, error, data }) => {
          if (error) return <View><Text>Error</Text></View>;
          let items = [];
          let modalContent = null;

          if (data.order && data.order.length > 0) {
            items = data.order[0].items;
            modalContent = this.renderModalContent(items);
          } else {
            modalContent = <View><Text>Sorry no items added to order yet</Text></View>
          }

          return (
            <View>
              <Modal
                isVisible={open}
                onSwipe={() => this.setState({ open: false })}
                swipeDirection="down"
                style={OrderStatusStyles.container}
              >
                {modalContent}
              </Modal>

              <Fab
                containerStyle={{ }}
                active={false}
                style={{ backgroundColor: 'springgreen' }}
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
    
    return (
      <View style={OrderStatusStyles.modalContent}>
        <View>
          <Ionicons name="ios-arrow-down" size={60} color="lightgrey" />
        </View>
        <H1>Modal Title</H1>

        <ScrollView>
          {this.getOrderProducts(items)}

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

          <View style={OrderStatusStyles.actionBtnWrapper}>
            <Mutation 
              mutation={ADD_ORDER_TO_USUALS}
              refetchQueries={() => {
                return [{
                   query: GET_CURRENT_USER,
                }];
              }}
            >
              {addOrderToUsualsById => (
                <Button 
                  transparent 
                  block 
                  primary 
                  onPress={() => addOrderToUsualsById({variables: {id: currentUser.order}})}
                >
                  <Text>Add order to usuals</Text>
                </Button>
              )}
            </Mutation>
          </View>
        </ScrollView>
      </View>
    );
  }

  getOrderProducts = (items) => {
    return items.map(item => {
      const combinedPrice = this.getCombinedPrices(item);
      let options = [];

      item.productModifiersOptions.forEach(mod => {
        options.push(mod.title)
      });

      options.push(`$${combinedPrice}`);

      return (
        <View key={item._id} style={OrderStatusStyles.cardWrapper}>
          <Mutation mutation={REMOVE_ORDER_ITEM}>
            {(removeOrderItem, { data }) => (
              <ExpandableCard 
                actionTitle="Remove item"
                items={[{title: item.product.title, options}]}
                onActionPress={() => removeOrderItem({variables: {id: item._id}})}
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

const ADD_ORDER_TO_USUALS = gql`
  mutation addOrderToUsualsById($id: String!) {
    addOrderToUsualsById(id: $id) {
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
