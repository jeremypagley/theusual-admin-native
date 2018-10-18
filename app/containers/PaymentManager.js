import React from 'react';
import { 
  Text,
  ListItem,
  Content,
  Header,
  Body,
  Icon,
  Card, 
  CardItem,
  Left,
  Right,
  Switch,
} from 'native-base';
import Expo from 'expo';
import { View, Dimensions } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';
import PaymentManagerStyles from 'app/styles/PaymentManagerStyles';
import Colors from 'app/styles/Colors';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import { ActivityIndicator, Platform } from 'react-native';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import Money from 'app/utils/money';
import Config from '../../config.json';

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
      amountValue: 20.0,
      autoReloadValue: false,
      token: '',
      creditCardLoading: false,
    }
  }

  componentWillMount() {
    Stripe.setOptionsAsync({
      publishableKey: Config.STRIPE_PUBLISHABLE_TEST_KEY,
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
        <CardItem 
          footer 
          button 
          onPress={() => this.toggleModal()} 
          style={[CardStyles.itemFooter, {backgroundColor: 'transparent', marginTop: -42}]}
        >
          <Left />
          <Right>
            <Text style={CardStyles.itemButtonTitle}>
              {hasBilling 
                ? 'Reload' 
                : 'Add a payment method'
              }
            </Text>
          </Right>
        </CardItem>


        <Modal
          isVisible={open}
          onSwipe={() => this.toggleModal()}
          swipeDirection="down"
          style={ContainerStyles.modalContainer}
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

    const balance = hasBilling ? Money.centsToUSD(currentUser.billing.balance) : null;

    return (
      <View style={ContainerStyles.modalContent}>
        <Header style={[ContainerStyles.modalHeader]}>
          <Left />
          <Body>
            <Text style={TypographyStyles.headerTitle}>Reload</Text>
          </Body>
          <Right>
            <Icon 
              onPress={() => this.toggleModal()} 
              name="md-close" 
              style={ContainerStyles.modalCloseIcon}
            />
          </Right>
        </Header>
        <Header style={ContainerStyles.header}></Header>

        <Content padder style={ContainerStyles.content}>
          <View style={CardStyles.card}>
            <Card transparent>
              <CardItem header style={CardStyles.itemHeader}>
                <Left>
                  <Text style={TypographyStyles.listTitle}>Active payment methods</Text>
                </Left>
              </CardItem>

              {hasBilling ? this.getActivePaymentItems() : null}

                <Mutation
                  mutation={CREATE_PAYMENT_METHOD}
                  refetchQueries={() => {
                    return [{query: GET_CURRENT_USER}, {query: GET_PAYMENT_METHODS}];
                  }}
                >
                  {createPaymentMethod => (
                    <ListItem
                      key={'creditcard'}
                      onPress={() => this.handleCardPayPress(createPaymentMethod)}
                      {...testID('cardFormButton')}
                    >
                      <Body>
                        {creditCardLoading 
                          ? <ActivityIndicator size="small" color="#00ff00" />
                          : <Text style={TypographyStyles.listSubItemTitle}>
                              Add a credit card
                            </Text>
                        }
                      </Body>
                      <Right>
                        <Icon style={{fontSize: 26, color: Colors.BrandRed}} name="md-add" />
                      </Right>
                    </ListItem>
                  )}
                </Mutation>
            </Card>
          </View>

          {hasBilling
            ? this.getBalanceCard(balance)
            : null
          }
          </Content>
      </View>
    );
  }

  getBalanceCard = (balance) => {
    return (
      <View style={[CardStyles.card]}>
        <Card transparent>
          <CardItem header style={CardStyles.itemHeader}>
            <Text style={TypographyStyles.listTitle}>Your balance</Text>
          </CardItem>
          
          <CardItem>
            <Body>
              <Text style={TypographyStyles.noteEmphasize}>{balance}</Text>
            </Body>
          </CardItem>

          <CardItem style={CardStyles.itemHeader}>
            <Text style={TypographyStyles.noteTitle}>Choose your reload amount</Text>
          </CardItem>

          {this.getAmountOptions()}

          {this.getReloadCardAction()}
        </Card>
      </View>
    )
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
                  <ListItem
                    key={source._id} 
                    style={[isSelected ? CardStyles.cardListItemSelected : {}]} 
                    onPress={() => this.setActivePaymentMethod(source.id, updateDefaultPaymentMethod)}
                  >
                    <Body>
                      <Text style={[TypographyStyles.listSubItemTitle, isSelected ? TypographyStyles.listSubItemTitleSelected : {}]}>
                        XXXX XXXX XXXX {source.last4}
                      </Text>
                    </Body>
                    <Right>
                      {isSelected ? <Icon style={{fontSize: 26, color: Colors.BrandRed}} name="md-checkmark" /> : null}
                    </Right>
                  </ListItem>
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

  getReloadCardAction = () => {
    const { amountValue } = this.state;

    return (
      <Mutation 
        mutation={RELOAD_BALANCE}
        refetchQueries={() => {
          return [{query: GET_CURRENT_USER}];
        }}
      >
        {(reloadBalance, { data, loading, error }) => {
          return (
            <CardItem 
              footer 
              button
              onPress={() => reloadBalance({
                variables: {
                  amount: amountValue,
                }
              })}
              style={[CardStyles.itemFooter, {paddingTop: 10, marginTop: 15}]}
            >
              <Left />
              <Right>
                <Text style={CardStyles.itemButtonTitle}>Confirm reload</Text>
              </Right>
            </CardItem>
          )
        }}
      </Mutation>
    )
  }

  getAmountOptions = () => {
    const amounts = [
      {label: '$20', value: 20.0},
      {label: '$30', value: 30.0},
      {label: '$40', value: 40.0},
      {label: '$50', value: 50.0},
      {label: '$100', value: 100.0},
    ]

    return amounts.map(amount => {
      const isSelected = this.state.amountValue === amount.value;

      return (
        <ListItem
          key={amount.value} 
          style={[isSelected ? CardStyles.cardListItemSelected : {}]} 
          onPress={() => this.setState({amountValue: amount.value})}
        >
          <Body>
            <Text style={[TypographyStyles.listSubItemTitle, isSelected ? TypographyStyles.listSubItemTitleSelected : {}]}>
              {amount.label}
            </Text>
          </Body>
          <Right>
            {isSelected ? <Icon style={{fontSize: 26, color: Colors.BrandRed}} name="md-checkmark" /> : null}
          </Right>
        </ListItem>
      )
    })
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
  mutation reloadBalance($amount: Float!) {
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
