import React from 'react';
import { 
  Text,
  Button,
  H1,
  H3,
  Fab,
} from 'native-base';
import { View, ScrollView } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';
import PaymentManagerStyles from 'app/styles/PaymentManagerStyles';
import Colors from 'app/styles/Colors';
import { Ionicons } from '@expo/vector-icons';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';

class PaymentManager extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      selectedPaymentMethod: null
    }
  }

  render() {
    let open = this.state.open;

    return (
      <View>
        <Button 
          transparent 
          block 
          primary
          large
          style={PaymentManagerStyles.actionBtn}
          onPress={() => {
            this.setState({ open: true });
          }}
        >
          <Text>Reload</Text>
        </Button>
        <Modal
          isVisible={open}
          onSwipe={() => this.setState({ open: false })}
          swipeDirection="down"
          style={PaymentManagerStyles.container}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );

  }

  renderModalContent = () => {
    const { currentUser } = this.props.data;
    if (!currentUser) return;

    return (
      <View style={PaymentManagerStyles.modalContent}>
        <View style={PaymentManagerStyles.closeIconWrapper}>
          <Ionicons name="ios-arrow-down" size={60} color="lightgrey" />
        </View>
        <H1 style={PaymentManagerStyles.title}>22</H1>
        <H3 style={PaymentManagerStyles.subtitle}>Balance</H3>

        <ScrollView>
          {/* {this.getOrderProducts(items, noOrderItems)}

          {!noOrderItems ?
          <View style={PaymentManagerStyles.actionBtnWrapper}>
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
                  style={PaymentManagerStyles.actionBtn}
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
          <View style={PaymentManagerStyles.actionBtnWrapper}>
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
                  style={PaymentManagerStyles.actionBtn}
                  onPress={() => createUsualByOrderId({variables: {id: currentUser.order}})}
                >
                  <Text>Add order to usuals</Text>
                </Button>
              )}
            </Mutation>
          </View>
          : null} */}
        </ScrollView>
      </View>
    );
  }

}

onValueChange = (value) => {
  this.setState({
    selectedPaymentMethod: value
  });
}

// const REMOVE_ORDER_ITEM = gql`
//   mutation removeOrderItem($id: String!) {
//     removeOrderItem(id: $id) {
//       _id
//     }
//   }
// `

// const CONFIRM_ORDER = gql`
//   mutation confirmOrder {
//     confirmOrder {
//       _id
//     }
//   }
// `

// const CREATE_USUAL = gql`
//   mutation createUsualByOrderId($id: String!) {
//     createUsualByOrderId(id: $id) {
//       _id
//     }
//   }
// `

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
)(PaymentManager);
