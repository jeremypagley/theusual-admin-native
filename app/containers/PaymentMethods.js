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
import PaymentMethodsStyles from 'app/styles/PaymentMethodsStyles';
import Colors from 'app/styles/Colors';
import { Ionicons } from '@expo/vector-icons';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import { Picker } from 'react-native-ui-lib';

const existingSources = [
  {label: 'Fake Card', value: 'js'},
  {label: 'Fake Apple Pay', value: 'java'},
];

class PaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: null,
    }
  }

  render() {
    const { open } = this.state;
    const { externalOpen } = this.props;
    let isVisible = open === null && externalOpen ? externalOpen : open;

    return (
      <View>
        <Picker
          value={this.state.language}
          placeholder="Add payment method"
          enableModalBlur={false}
          onChange={item => {
            console.log('onChange picker: ', item)
            this.setState({language: item})
          }}
          topBarProps={{title: 'Languages'}}
          style={{color: Colors.red20}}
          hideUnderline
          renderItem={this.getCustomPickerItem}
          showSearch={false}
          searchPlaceholder={'Search a language'}
          searchStyle={{color: Colors.blue30, placeholderTextColor: Colors.dark50}}
          // onSearchChange={value => console.warn('value', value)}
        >
          {existingSources.map(option => <Picker.Item key={option.value} value={option} disabled={option.disabled} />)}
          <Picker.Item key={'addCard'} value={this.getAddCardNode()} />
        </Picker>
      </View>
    );

  }

  getCustomPickerItem = (item) => {
    console.log('getCustomPickerItem item:', item)
    return (
      <View>
        <Ionicons name="md-add" size={10} color="lightgrey" />
        <Text>Add a payment method</Text>
      </View>
    )
  }

  getAddCardNode = () => {
    return (
      <View>
        <Ionicons name="md-add" size={10} color="lightgrey" />
        {/* <Text>Add a credit card</Text> */}
      </View>
    )
  }

  pickOption = (index) => {
    this.setState({
      pickedOption: index,
    });
  }

  renderModalContent = () => {
    const { currentUser } = this.props.data;
    const { showCustom } = this.state;
    if (!currentUser) return;

    return (
      <View style={PaymentMethodsStyles.modalContent}>
        <View style={PaymentMethodsStyles.closeIconWrapper}>
          <Ionicons name="ios-arrow-down" size={60} color="lightgrey" />
        </View>
        <H1 style={PaymentMethodsStyles.title}>22</H1>
        <H3 style={PaymentMethodsStyles.subtitle}>Balance</H3>
      </View>
    );
  }

  getAddPaymentButton = () => {
    return (
      <View>
        <Ionicons name="md-add" size={10} color="lightgrey" />
        <Text>Add a payment method</Text>
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
)(PaymentMethods);
