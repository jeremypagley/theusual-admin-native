import React from 'react';
import { 
  Container,
  Text,
  List,
  ListItem,
  Content,
  Header,
  Body,
  Button,
  Input,
  Item,
  Label,
  Icon,
  H1,
  H3,
  Card, 
  CardItem,
  Left,
  Right,
  Switch,
  Picker,
  Form,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';
import PaymentManagerStyles from 'app/styles/PaymentManagerStyles';
import Colors from 'app/styles/Colors';
import { Ionicons } from '@expo/vector-icons';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import { ActivityIndicator, Platform } from 'react-native';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import CardListStyles from 'app/styles/generic/CardListStyles';
import ContainerStyles from 'app/styles/generic/ContainerStyles';

function testID(id) {
  return Platform.OS === 'android' ? { accessible: true, accessibilityLabel: id } : { testID: id };
}

class PaymentManager extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      token: '',
      selectedPaymentMethod: null,
      amountValue: 20,
      autoReloadValue: false,
      token: '',
      creditCardLoading: false,
    }
  }

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
    let open = this.state.open;
    const { currentUser } = this.props.data;

    return (
      <View>
        <Button 
          transparent 
          block 
          primary
          large
          style={PaymentManagerStyles.actionBtn}
          onPress={() => this.toggleModal()}
        >
          <Text>Reload</Text>
        </Button>


        <Modal
          isVisible={open}
          onSwipe={() => this.toggleModal()}
          swipeDirection="down"
          style={PaymentManagerStyles.container}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );

  }

  toggleModal = () => {
    const { open } = this.state;
    this.setState({ open: !open })
  }

  renderModalContent = () => {
    const { currentUser } = this.props.data;
    const { creditCardLoading, applePayLoading } = this.state;
    if (!currentUser) return;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}>
          <Body>
            <H1>Payment methods</H1>
          </Body>
        </Header>
        
        <View style={PaymentManagerStyles.actionBtnWrapperIcon}>
          <Icon 
            onPress={() => this.toggleModal()} 
            name="md-close" 
            style={PaymentManagerStyles.closeIconX}
          />
        </View>
        
        <Grid>
          <Row size={4}>
            <Content>
              <List>
                <ListItem itemHeader first style={CardListStyles.listItem}>
                  <Text>ACTIVE PAYMENT METHODS</Text>
                </ListItem>
                <Card style={CardListStyles.card}>
                  {this.getActivePaymentItems()}

                  <CardItem 
                    button 
                    onPress={() => this.onAddActivePaymentItemPress('creditCard')} 
                    key={'creditcard'} 
                    style={CardListStyles.cardItem}
                    {...testID('cardFormButton')}
                  >
                    <Left>
                      <Icon name="md-add" />
                      {creditCardLoading 
                        ? <ActivityIndicator size="small" color="#00ff00" />
                        : <Text style={CardListStyles.cardItemIconTitle}>
                            Add a credit card
                          </Text>
                      }
                    </Left>
                  </CardItem>

                  <CardItem 
                    button 
                    onPress={() => this.onAddActivePaymentItemPress('applePay')} 
                    key={'applepay'} 
                    style={CardListStyles.cardItem} 
                    {...testID('cardFormButton')}
                  >
                    <Left>
                      <Icon name="md-add" />
                      {creditCardLoading 
                        ? <ActivityIndicator size="small" color="#00ff00" />
                        : <Text style={CardListStyles.cardItemIconTitle}>
                            Add Apple Pay
                          </Text>
                      }
                    </Left>
                  </CardItem>
                </Card>
              </List>
            </Content>
          </Row>

          <Row size={5}>
            <Content>
              <ListItem itemHeader first style={CardListStyles.listItem}>
                <Text>MANAGE BALANCE</Text>
              </ListItem>
              <Card style={CardListStyles.card}>
                <CardItem style={CardListStyles.cardItem}>
                  <Body>
                    <H1 style={CardListStyles.cardItemTitle}>{/*currentUser.payment.balance*/}$20.00</H1>
                    <H3 style={CardListStyles.cardItemTitle}>My balance</H3>
                  </Body>
                </CardItem>

                <CardItem style={CardListStyles.cardItem}>
                  <Body>
                    {this.getAmountField()}
                  </Body>
                </CardItem>

                <CardItem style={CardListStyles.cardItem}>
                  <Body>
                    {this.getAutoReloadField()}
                  </Body>
                </CardItem>
              </Card>
            </Content>
          </Row>
        </Grid>
      </Container>
    );
  }

  getActivePaymentItems = () => {
    const { search } = this.state;
    let data = {}
    // will be currentUser.billing.sources
    data.sources = [{_id: 'fake payment', title: 'fake payment'}]

    return data.sources.map((source) => {
      return (
        <Mutation 
          mutation={RELOAD_FUNDS}
          refetchQueries={() => {
            return [{
              query: GET_CURRENT_USER,
            }];
          }}
        >
          {updateDefaultPaymentMethod => (
            <CardItem 
              button 
              onPress={() => this.onActivePaymentItemPress(source, updateDefaultPaymentMethod)} 
              key={source._id} 
              style={CardListStyles.cardItem}
            >
              <Body>
                <Label style={CardListStyles.cardItemTitle}>{source.title}</Label>
              </Body>
            </CardItem>
          )}
        </Mutation>
      );
    });
  }

  onAddActivePaymentItemPress = (type) => {
    if (type === 'creditCard') {
      return this.handleCardPayPress();
    } else if (type === 'applePay') {
      console.log('TODO....')
    }
  }

  onActivePaymentItemPress = (source, updateDefaultPaymentMethod) => {


    // TODO: add updateDefaultPaymentMethod with mutation
    console.log('TODO: Swap default source to selected source')
  }

  getReloadAction = () => {
    const { amountValue, payingWithValue, autoReloadValue } = this.state;

    return (
      <Mutation 
        mutation={RELOAD_FUNDS}
        refetchQueries={() => {
          return [{
            query: GET_CURRENT_USER,
          }];
        }}
      >
        {reloadBalance => (
          <Button 
            transparent 
            block 
            primary
            large
            style={PaymentManagerStyles.actionBtn}
            onPress={() => reloadBalance({
              variables: {
                customerId: currentUser.stripeCustomerId,
                amount: amountValue.rawValue,
                // TODO: this should be the customers id
                sourceToken: this.state.token,
              }
            })}
          >
            <Text>Confirm Reload</Text>
          </Button>
        )}
      </Mutation>
    )
  }

  getAmountField = () => {
    return (
      <Form>
        <Picker
          mode="dropdown"
          style={{ width: 120 }}
          selectedValue={this.state.amountValue}
          iosIcon={<Icon name="ios-arrow-down-outline" />}
          onValueChange={(value) => this.setState({amountValue: value})}
        >
          <Picker.Item label="$20" value={20} />
          <Picker.Item label="$30" value={30} />
          <Picker.Item label="$40" value={40} />
        </Picker>
      </Form>
    )
  }

  getAutoReloadField = () => {
    const { autoReloadValue } = this.state;
    return (
      <ListItem>
        <Left>
          <Text>Auto reload</Text>
        </Left>
        <Right>
          <Switch 
            onValueChange={(val) => this.setState({autoReloadValue: !autoReloadValue})} 
            value={autoReloadValue}
          />
        </Right>
      </ListItem>
    )
  }
}

const RELOAD_FUNDS = gql`
  mutation reloadBalance($customerId: String!, $amount: Number, $payingWithSourceId: String!) {
    reloadBalance(customerId: $customerId, amount: $amount, payingWithSourceId: $payingWithSourceId) {
      _id,
      payment
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
)(PaymentManager);
