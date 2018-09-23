import React from 'react';
import { 
  H1,
  H3,
  ListItem,
  Icon,
  Right,
  Left,
  Body,
  Switch,
  Text,
  Button
} from 'native-base';
import { View } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';
import PaymentManagerStyles from 'app/styles/PaymentManagerStyles';
import Colors from 'app/styles/Colors';
import { Ionicons } from '@expo/vector-icons';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import CardForm from 'app/components/stripe/CardForm';
import DropdownStyles from 'app/styles/DropdownStyles';
import Dropdown from 'react-native-modal-dropdown';

const amountFieldData = [
  {value: 20},
  {value: 30},
  {value: 40},
  {value: 50},
  {value: 100},
]

class PaymentManager extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      token: '',
      selectedPaymentMethod: null,
      showPaymentMethodsDialog: false,
      payingWithValue: {value: 'sourceId1', key: 'id1', highlighted: false},
      amountValue: {value: '$20', key: 'id2', highlighted: false},
      autoReloadValue: false,
      amountOptions: [
        {value: '$20', key: '20', rawValue: 20, highlighted: false},
        {value: '$30', key: '30', rawValue: 30, highlighted: false},
        {value: '$40', key: '40', rawValue: 40, highlighted: false},
        {value: '$50', key: '50', rawValue: 50, highlighted: false},
      ],
      payingWithOptions: [
        {value: 'sourceId1', key: 'id1', highlighted: false},
        {value: 'sourceID2', key: 'id2', highlighted: false},
      ]
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
          onPress={() => this.setState({ open: true })}
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
        <View style={PaymentManagerStyles.actionBtnWrapperIcon}>
          <Icon 
            onPress={() => this.setState({open: false})} 
            name="md-close" 
            style={PaymentManagerStyles.closeIconX}
          />
        </View>
        
        <Text style={PaymentManagerStyles.title}>$30</Text>
        <Text style={PaymentManagerStyles.subtitle}>My balance</Text>

        <View style={PaymentManagerStyles.listItemWrapper}>
          {this.getAmountField()}
          {this.getPayingWithField()}
          {/* {this.getAutoReloadField()} */}
        </View>

        {this.getReloadAction()}
      </View>
    );
  }

  getReloadAction = () => {
    const { amountValue, payingWithValue, autoReloadValue } = this.state;
    
    return (
      <Mutation 
        mutation={CONFIRM_ORDER}
        refetchQueries={() => {
          return [{
            query: GET_CURRENT_USER,
          }];
        }}
      >
        {reloadFunds => (
          <Button 
            transparent 
            block 
            primary
            large
            style={PaymentManagerStyles.actionBtn}
            onPress={() => reloadFunds({
              variables: {
                customerId: currentUser.customerId,
                amount: amountValue.rawValue,
                // TODO: this should be the customers id
                payingWithSourceId: payingWithValue.value,
              }
            })}
          >
            <Text>Confirm Reload</Text>
          </Button>
        )}
      </Mutation>
    )
  }

  getDropdownLabel = (type) => {
    let label = 'Amount';

    if (type === 'autoReload') label = 'Auto reload';
    if (type === 'payingWith') label = 'Paying with';

    return (
      <Text>{label}</Text>
    )
  }

  onDropdownFieldChange = (type, index, option) => {
    // if (type === 'payingWithValue' && option.key === 'addpayment') {

    // }
    this.setState({[type]: option});
  }

  getAmountField = () => {
    return (
      <View style={PaymentManagerStyles.dropdownContainer}>
        <View style={PaymentManagerStyles.dropdownWrapper}>
          <Dropdown 
            options={this.state.amountOptions}
            renderRow={(option, key, isSelected) => <Text key={key} bold={isSelected} style={DropdownStyles.dropdownRow}>{option.value}</Text>}
            renderButtonText={(option) => this.getDropdownDefaultNode('Amount', 'amountValue', option)}
            renderSeparator={() => <View style={DropdownStyles.dropdownSeparator}></View>}
            onSelect={(index, option) => this.onDropdownFieldChange('amountValue', index, option)}
            defaultValue={this.getDropdownDefaultNode('Amount', 'amountValue')}
            style={DropdownStyles.dropdownContainer}
            dropdownStyle={DropdownStyles.dropdownInner}
          />
        </View>
      </View>
    )
  }

  getPayingWithField = () => {
    let options = this.state.payingWithOptions;
    options.push({key: 'addpayment', value: this.getAddPaymentRowValue(), highlighted: false});

    return (
      <View style={PaymentManagerStyles.dropdownContainer}>
        <View style={PaymentManagerStyles.dropdownWrapper}>
          <Dropdown 
            options={options}
            renderRow={(option, key, isSelected) => <Text key={key} bold={isSelected} style={DropdownStyles.dropdownRow}>{option.value}</Text>}
            renderButtonText={(option) => this.getDropdownDefaultNode('Paying with', 'payingWithValue', option)}
            renderSeparator={() => <View style={DropdownStyles.dropdownSeparator}></View>}
            onSelect={(index, option) => this.onDropdownFieldChange('payingWithValue', index, option)}
            defaultValue={this.getDropdownDefaultNode('Paying with', 'payingWithValue')}
            style={DropdownStyles.dropdownContainer}
            dropdownStyle={DropdownStyles.dropdownInner}
          />
        </View>
      </View>
    )
  }

  getAddPaymentRowValue = () => {
    return (
      <CardForm handleCardPayPress={token => this.setState({token: token})} />
    )
  }

  getDropdownDefaultNode = (manualTitle, type, option) => {
    const opt = option ? option : this.state[type];

    return (
      <View style={DropdownStyles.display}>
        <View style={DropdownStyles.displayColLeft}><Text>{manualTitle}</Text></View>

        <View style={DropdownStyles.displayColRight}>
          <Text>{opt && opt.value}</Text>
        </View>
        <View style={DropdownStyles.displayColRight}>
          <Icon 
            // onPress={() => this.setState({open: false})} 
            name="ios-arrow-down" 
            // style={PaymentManagerStyles.closeIconX}
          />
        </View>
      </View>
    )
  }

  getDropdownDipslayNode = (label, type, option) => {
    return (
      <View>
        <Text>{label} {option && option.value}</Text>
        <Icon 
          // onPress={() => this.setState({open: false})} 
          name="ios-arrow-down" 
          // style={PaymentManagerStyles.closeIconX}
        />
      </View>
    )
  }

  getAutoReloadField = () => {
    const { autoReloadValue } = this.state;
    return (
      <ListItem noIndent>
        <Left>
          <Text>Auto reload</Text>
        </Left>
        <Right>
          <Switch onValueChange={() => this.onDropdownFieldChange('autoReloadValue', !autoReloadValue)} value={autoReloadValue} />
        </Right>
      </ListItem>
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

const CONFIRM_ORDER = gql`
  mutation confirmOrder {
    confirmOrder {
      _id
    }
  }
`

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
