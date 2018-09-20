import React from 'react';
import { 
  H1,
  H3,
} from 'native-base';
import { ScrollView } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import { Left, Right } from 'native-base';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';
import PaymentManagerStyles from 'app/styles/PaymentManagerStyles';
import Colors from 'app/styles/Colors';
import { Ionicons } from '@expo/vector-icons';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import { Dialog, Button, View, Text } from 'react-native-ui-lib';
import CardForm from 'app/components/stripe/CardForm';

class PaymentManager extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      selectedPaymentMethod: null,
      showPaymentMethodsDialog: false
    }
  }

  render() {
    let open = this.state.open;

    return (
      <View>
        <Button text60 label="Reload" link onPress={() => this.setState({ open: true })} />

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
        
        <Button
          marginT-20
          size={'small'}
          label="Paying with"
          onPress={() => this.setState({showPaymentMethodsDialog: true})}
        />

        <Dialog
          visible={this.state.showPaymentMethodsDialog}
          width="100%"
          height="40%"
          bottom
          centerH
          onDismiss={() => this.setState({showPaymentMethodsDialog: false})}
          animationConfig={{duration: 250}}
        >
          {this.renderDialogContent()}
        </Dialog>

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

  renderDialogContent = () => {
    return (
      <View bg-white flex br20 padding-18 spread br0>
        <Text text50>List of existing Sources</Text>

        <CardForm />

        <View right>
          <Button text60 label="Done" link onPress={() => this.setState({showPaymentMethodsDialog: false})} />
        </View>
      </View>
    );
  }

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
