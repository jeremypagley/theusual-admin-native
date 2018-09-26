import React from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { ListItem, Left, Right, Icon, Text, Body, Button, List } from 'native-base';
import CardFormStyles from 'app/styles/CardFormStyles';

function testID(id) {
  return Platform.OS === 'android' ? { accessible: true, accessibilityLabel: id } : { testID: id };
}

class PaymentMethods extends React.Component {
  state = {
    token: '',
    loading: false,
  };

  componentWillMount() {
    Stripe.setOptionsAsync({
      publishableKey: 'pk_test_CsV5D9WegDZKiJINmWBDj39Z',
    });
  }

  handleCardPayPress = async () => {
    try {
      this.setState({ loading: true, token: null });
      const token = await Stripe.paymentRequestWithCardFormAsync({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        // prefilledInformation: {
        //   billingAddress: {
        //     name: 'Gunilla Haugeh',
        //     line1: 'Canary Place',
        //     line2: '3',
        //     city: 'Macon',
        //     state: 'Georgia',
        //     country: 'US',
        //     postalCode: '31217',
        //     email: 'ghaugeh0@printfriendly.com',
        //   },
        // },
      });

      this.setState({ loading: false, token });
      this.props.handleCardPayPress(token);
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, token } = this.state;

    return (
      <Button full transparent iconLeft onPress={this.handleCardPayPress} {...testID('cardFormButton')}>
        <Icon active name="md-add" />
        {loading 
          ? <ActivityIndicator size="small" color="#00ff00" />
          : <Text>Add a payment method</Text>
        }
      </Button>
    );
  }
}

export default PaymentMethods;
