import React from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { ListItem, Left, Right, Icon, Text, Body, Button, List } from 'native-base';
import CardFormStyles from 'app/styles/CardFormStyles';

function testID(id) {
  return Platform.OS === 'android' ? { accessible: true, accessibilityLabel: id } : { testID: id };
}

export default class CardFormScreen extends React.Component {
  state = {
    token: '',
    loading: false,
  };

  componentWillMount() {
    Stripe.setOptionsAsync({
      publishableKey: 'pk_test_M315xbWEvSQjt7B8ZJYzuipC',
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

  getCustomerSources = () => {
    let sources = ['XXXX-XXXX-XXXX-4242']
    return sources.map(source => {
      return (
        <ListItem>
          <Left>
            <Text>{source}</Text>
          </Left>
          <Right>
            <Icon active name="arrow-down" />
          </Right>
        </ListItem>
      )
    });
  }

  render() {
    const { loading, token } = this.state;

    return (
      <List style={CardFormStyles.list}>
        {this.getCustomerSources()}
        <ListItem icon onPress={this.handleCardPayPress} {...testID('cardFormButton')}>
          <Left>
            <Button style={{ backgroundColor: "#FF9501" }}>
              <Icon active name="md-add" />
            </Button>
            {loading 
              ? <ActivityIndicator size="small" color="#00ff00" />
              : <Text>Add a payment method</Text>
            }
          </Left>
        </ListItem>
      </List>
    );
  }
}
