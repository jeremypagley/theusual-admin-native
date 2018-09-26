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
  H4,
  Card, 
  CardItem,
  Left,
  Right,
  Switch,
  Picker,
  Form,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, Dimensions } from 'react-native';
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
const screenWidth = Dimensions.get('window').width;

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
        prefilledInformation: {
          billingAddress: {
            name: 'Jeremy K Pagley',
            line1: '777 North Orange Ave',
            line2: '412',
            city: 'Orlando',
            state: 'FL',
            country: 'United States',
            postalCode: '32801',
            email: 'jeremyjkp@gmail.com',
          },
        },
      });

      this.setState({ loading: false, token });
      return cardHandler({variables: { token: token.tokenId }});
      
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  render() {
    const open = this.state.open;
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
    if (!currentUser) return null;

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
                      return [{query: GET_CURRENT_USER}, {query: GET_PAYMENT_METHODS}];
                    }}
                  >
                    {createPaymentMethod => (
                      <View>
                        <CardItem 
                          button 
                          onPress={() => this.handleCardPayPress(createPaymentMethod)} 
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
                          onPress={() => console.log('applePay')} 
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
                      <Body style={CardListStyles.itemBody}>
                        <Text style={CardListStyles.cardItemTitleColor}>${currentUser.billing.balance}</Text>
                        <Text style={CardListStyles.cardItemSubTitle}>My balance</Text>
                      </Body>
                    </CardItem>

                    <CardItem style={CardListStyles.cardItem}>
                      <Body style={CardListStyles.itemBody}>
                        {this.getAmountField()}
                      </Body>
                    </CardItem>

                    <CardItem style={CardListStyles.cardItem}>
                      <Body style={CardListStyles.itemBody}>
                        {this.getReloadAction()}
                      </Body>
                    </CardItem>

                    {/* {this.getAutoReloadField()} */}
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
    const { currentUser } = this.props.data;
    const { billing: { stripeCustomer } } = currentUser;

    return (
      <Query query={GET_PAYMENT_METHODS}>
        {({ loading, error, data }) => {

          if (loading) return <Text key="loading">Loading...</Text>;
          if (error) return <Text key="error">Error :(</Text>;

          return data.paymentMethods.map(source => {
            const { selectedPaymentMethod } = this.state;
            const isSelected = stripeCustomer.default_source === source.id;

            return (
              <Mutation
                key={source.id}
                mutation={UPDATE_DEFAULT_PAYMENT_METHOD}
                refetchQueries={() => {
                  return [{query: GET_CURRENT_USER}, {query: GET_PAYMENT_METHODS}];
                }}
              >
                {updateDefaultPaymentMethod => (
                  <CardItem
                    key={source.id}
                    button 
                    onPress={() => this.setActivePaymentMethod(source.id, updateDefaultPaymentMethod)} 
                    key={source._id} 
                    style={[CardListStyles.cardItem, isSelected ? CardListStyles.cardItemSelected : {}]}
                  >
                    <Left>
                      {isSelected ? <Icon fontSize={24} style={CardListStyles.cardItemIconSelected} name="md-checkmark" /> : null}
                      <Text 
                        style={[CardListStyles.cardItemTitle, isSelected ? CardListStyles.cardItemTitleSelected : {}]}
                      >
                        XXXX XXXX XXXX {source.last4}
                      </Text>
                    </Left>
                  </CardItem>
                )}
              </Mutation>
            )
          })
        }}
      </Query>
    )
  }

  setActivePaymentMethod = (sourceId, updateDefaultPaymentMethod) => {
    if (!sourceId) return console.log('no source id: ', sourceId)
    updateDefaultPaymentMethod({variables: { source: sourceId }});
  }

  getReloadAction = () => {
    const { amountValue } = this.state;
    const { currentUser } = this.props.data;

    return (
      <Mutation 
        mutation={RELOAD_BALANCE}
        refetchQueries={() => {
          return [{query: GET_CURRENT_USER}];
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
                amount: amountValue,
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
      <Picker
        mode="dropdown"
        style={{ width: screenWidth-20 }}
        selectedValue={this.state.amountValue}
        iosIcon={<Icon name="ios-arrow-down-outline" />}
        onValueChange={(value) => this.setState({amountValue: value})}
      >
        <Picker.Item label="$20" value={20} />
        <Picker.Item label="$30" value={30} />
        <Picker.Item label="$40" value={40} />
      </Picker>
    )
  }

  getAutoReloadField = () => {
    const { autoReloadValue } = this.state;
    return (
      <ListItem icon style={PaymentManagerStyles.autoReload}>
        <Left>
          {/* <Button style={{ backgroundColor: "#FF9501" }}>
            <Icon active name="plane" />
          </Button> */}
          <Text>Auto Reload</Text>
        </Left>
        <Body>
          {/* <Text>Airplane Mode</Text> */}
        </Body>
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
  mutation reloadBalance($amount: Number) {
    reloadBalance(amount: $amount) {
      _id,
      email,
      billing {
        balance,
        stripeCustomer {
          id
          default_source
        }
      }
    }
  }
`

const UPDATE_DEFAULT_PAYMENT_METHOD = gql`
  mutation updateDefaultPaymentMethod($source: String!) {
    updateDefaultPaymentMethod(source: $source) {
      _id,
      email,
      billing {
        balance,
        stripeCustomer {
          id
          default_source
        }
      }
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
        stripeCustomer {
          id
          default_source
        }
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
          stripeCustomer {
            id
            default_source
          }
        }
      }
    }
  `
)(PaymentManager);
