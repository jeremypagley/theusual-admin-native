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

  handleCardPayPress = async (cardHandler) => {
    try {
      this.setState({ loading: true, token: null });
      const token = await Stripe.paymentRequestWithCardFormAsync({
        // Only iOS support this options
        smsAutofillDisabled: false,
        requiredBillingAddressFields: 'full',
        // prefilledInformation: {
        //   billingAddress: {
        //     name: 'Jeremy K Pagley',
        //     line1: '777 North Orange Ave',
        //     line2: '412',
        //     city: 'Orlando',
        //     state: 'FL',
        //     country: 'United States',
        //     postalCode: '32801',
        //     email: 'jeremyjkp@gmail.com',
        //   },
        // },
      });

      this.setState({ loading: false, token });
      cardHandler({variables: { token: token.tokenId }});
      
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  render() {
    let open = this.state.open;
    const { currentUser } = this.props.data;
    if (!currentUser) return null;

    const hasBilling = currentUser.billing;

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
          <Text>
            {hasBilling 
              ? 'Reload' 
              : 'Add a payment method'
            }
          </Text>
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

    const hasBilling = currentUser.billing; 

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
                  {hasBilling ? this.getActivePaymentItems() : null}

                  <Mutation
                    mutation={CREATE_PAYMENT_METHOD}
                    refetchQueries={() => {
                      return [{
                        query: GET_CURRENT_USER,
                      }];
                    }}
                  >
                    {createPaymentMethod => (
                      <View>
                        <CardItem 
                          button 
                          onPress={() => this.onAddActivePaymentItemPress('creditCard', createPaymentMethod)} 
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
                      </View>
                    )}
                  </Mutation>
                </Card>
              </List>
            </Content>
          </Row>

          {hasBilling
            ? <Row size={5}>
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
            : null
          }
          
        </Grid>
      </Container>
    );
  }

  getActivePaymentItems = () => {
    return (
      <Query query={GET_PAYMENT_METHODS}>
        {({ loading, error, data }) => {
          console.log('GET_PAYMENT_METHODS error: ', error)
          console.log('GET_PAYMENT_METHODS data: ', data)
          if (loading) return <Text key="loading">Loading...</Text>;
          if (error) return <Text key="error">Error :(</Text>;

          return data.paymentMethods.map(source => {
            const isSelected = this.state.selectedPaymentMethod === source.id;
            console.log('source: ', source)

            return (
              <Mutation
                key={source.id}
                mutation={RELOAD_BALANCE}
                refetchQueries={() => {
                  return [{
                    query: GET_CURRENT_USER,
                  }];
                }}
              >
                {updateDefaultPaymentMethod => (
                  <CardItem
                    key={source.id}
                    button 
                    onPress={() => this.onActivePaymentItemPress(source, updateDefaultPaymentMethod)} 
                    key={source._id} 
                    style={[CardListStyles.cardItem, isSelected ? CardListStyles.cardItemSelected : {}]}
                  >
                    <Body>
                      <Text 
                        style={[CardListStyles.cardItemTitle, isSelected ? CardListStyles.cardItemTitleSelected : {}]}
                      >
                        XXXX XXXX XXXX {source.last4}
                      </Text>
                    </Body>
                  </CardItem>
                )}
              </Mutation>
            )
          })
        }}
      </Query>
    )
  }



  onAddActivePaymentItemPress = (type, cardHandler) => {
    if (type === 'creditCard') {
      return this.handleCardPayPress(cardHandler);
    } else if (type === 'applePay') {
      console.log('TODO....')
    }
  }

  onActivePaymentItemPress = (source, updateDefaultPaymentMethod) => {

    this.setState({ selectedPaymentMethod: source.id });
    // TODO: add updateDefaultPaymentMethod with mutation
    console.log('TODO: Swap default source to selected source')
  }

  getReloadAction = () => {
    const { amountValue, payingWithValue, autoReloadValue } = this.state;

    return (
      <Mutation 
        mutation={RELOAD_BALANCE}
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

const RELOAD_BALANCE = gql`
  mutation reloadBalance($customerId: String!, $amount: Number, $payingWithSourceId: String!) {
    reloadBalance(customerId: $customerId, amount: $amount, payingWithSourceId: $payingWithSourceId) {
      _id,
      payment
    }
  }
`

const CREATE_PAYMENT_METHOD = gql`
  mutation createPaymentMethod($token: String!) {
    createPaymentMethod(token: $token) {
      _id,
      email,
      billing {
        balance,
        stripeCustomerId
      }
    }
  }
`

const GET_PAYMENT_METHODS = gql`
{
  paymentMethods {
    id
    last4
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
        billing {
          balance
          stripeCustomerId
        }
      }
    }
  `
)(PaymentManager);
