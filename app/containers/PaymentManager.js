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
import { Left, Right } from 'native-base';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';
import PaymentManagerStyles from 'app/styles/PaymentManagerStyles';
import Colors from 'app/styles/Colors';
import { Ionicons } from '@expo/vector-icons';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import { Dialog, Button as UIButton, View as UIView, Text as UIText } from 'react-native-ui-lib';
import PaymentMethods from 'app/containers/PaymentMethods';
import CardForm from 'app/components/stripe/CardForm';

class PaymentManager extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      selectedPaymentMethod: null,
      showCustom: false,
      paymentManagerOpen: false
    }
  }

  render() {
    let open = this.state.open;
    const { paymentManagerOpen } = this.state;

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

  pickOption = (index) => {
    this.setState({
      pickedOption: index,
    });
  }

  renderDialogContent = (dialogIndex, extraProps) => {
    return (
      <UIView bg-white flex br20 padding-18 spread {...extraProps}>
        <UIText text50>List of existing Sources</UIText>
        <CardForm />
        <UIView right>
          <UIButton text60 label="Done" link onPress={() => this.setState({[`showDialog${dialogIndex}`]: false})} />
        </UIView>
      </UIView>
    );
  }

  renderModalContent = () => {
    const { currentUser } = this.props.data;
    const { showCustom } = this.state;
    if (!currentUser) return;

    return (
      <View style={PaymentManagerStyles.modalContent}>
        <View style={PaymentManagerStyles.closeIconWrapper}>
          <Ionicons name="ios-arrow-down" size={60} color="lightgrey" />
        </View>
        <H1 style={PaymentManagerStyles.title}>22</H1>
        <H3 style={PaymentManagerStyles.subtitle}>Balance</H3>

        {/* <Button 
          transparent 
          block 
          primary
          large
          style={PaymentManagerStyles.actionBtn}
          onPress={() => {
            this.setState({ showCustom: !showCustom });
          }}
        >
          <View>
            <View>
              <Text>Paying with</Text>
            </View>
          </View>
        </UIButton> */}
        
        {/* For more custom just use Dialog */}

        
        {/* <ActionSheet
          title="Select payment method"
          message="Message of action sheet"
          cancelButtonIndex={3}
          destructiveButtonIndex={0}
          options={[
            {label: 'option 1', onPress: () => this.pickOption('option 1')},
            {label: 'option 2', onPress: () => this.pickOption('option 2')},
            {label: <View>{this.getAddPaymentNode()}</View>},
          ]}
          visible={showCustom}
          onDismiss={() => this.setState({showCustom: false})}
        /> */}
        <UIButton
          marginT-20
          size={'small'}
          label="Paying with"
          onPress={() => this.setState({showDialog2: true})}
        />

        <Dialog
          visible={this.state.showDialog2}
          width="100%"
          height="35%"
          bottom
          centerH
          onDismiss={() => this.setState({showDialog2: false})}
          animationConfig={{duration: 250}}
        >
          {this.renderDialogContent(2, {br0: true})}
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

  addPaymentMethod = (index) => {
    this.setState({ paymentManagerOpen: true });
  }

  getAddPaymentNode = () => {
    return (
      <View>
        <PaymentMethods />
        {/* <Button 
          transparent 
          block 
          primary
          large
          style={PaymentManagerStyles.actionBtn}
          onPress={() => this.addPaymentMethod()}
        >
          <View>
            <Ionicons name="md-add" size={10} color="lightgrey" />
            <Text>Add a payment method</Text>
          </View>
        </Button> */}
      </View>
    )
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
