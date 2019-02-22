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
import GenericError from 'app/components/GenericError';
import { compose } from 'react-apollo';

function testID(id) {
  return Platform.OS === 'android' ? { accessible: true, accessibilityLabel: id } : { testID: id };
}

class PaymentManager extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      token: '',
      selectedPaymentMethodSource: null,
      amountValue: 20.0,
      autoReloadValue: false,
      token: '',
      creditCardLoading: false,
    }
  }

  componentWillMount() {
    // Stripe.setOptionsAsync({
    //   publishableKey: Config.STRIPE_PUBLISHABLE_TEST_KEY,
    // });
  }

  handleCardPayPress = async (cardHandler) => {
    try {
      this.setState({ creditCardLoading: true, token: null });
      const token = await Stripe.paymentRequestWithCardFormAsync({
        // Only iOS support this options
        smsAutofillDisabled: false,
        requiredBillingAddressFields: 'full',
      });

      this.setState({ creditCardLoading: false, token });
      return cardHandler({variables: { token: token.tokenId }});
      
    } catch (error) {
      this.setState({ creditCardLoading: false });
    }
  };

  render() {
    const { open, onModalToggle } = this.props;
    const { currentUser } = this.props.currentUser;

    if (!currentUser) return null;

    const hasBilling = currentUser.billing;

    return (
      <View>
        <CardItem 
          footer 
          button 
          onPress={() => onModalToggle()} 
          style={[CardStyles.itemFooter, {backgroundColor: 'transparent', marginTop: -42}]}
        >
          <Left />
          <Right>
            <Text style={[CardStyles.itemButtonTitle, {width: 200}]}>
              {hasBilling 
                ? 'Reload' 
                : 'Add a payment method'
              }
            </Text>
          </Right>
        </CardItem>

        <Modal
          isVisible={open}
          onSwipe={() => onModalToggle()}
          swipeDirection="down"
          style={ContainerStyles.modalContainer}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );

  }

  renderModalContent = () => {
    const { currentUser } = this.props.currentUser;
    const { creditCardLoading, applePayLoading } = this.state;

    const hasBilling = currentUser && currentUser.billing;

    return (
      <View style={ContainerStyles.modalContent}>
        <Header style={[ContainerStyles.modalHeader]}>
          <Left />
          <Body>
            <Text style={TypographyStyles.headerTitle}>Reload</Text>
          </Body>
          <Right>
            <Icon 
              onPress={() => this.props.onModalToggle()} 
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

              {this.getActivePaymentItems()}

              <Mutation
                mutation={CREATE_PAYMENT_METHOD}
                refetchQueries={(data) => {
                  let getPaymentMethodsQuery = {
                    query: GET_PAYMENT_METHODS,
                    variables: { userId: data.createPaymentMethod && data.createPaymentMethod._id ? data.createPaymentMethod._id : currentUser._id}
                  }
                  
                    return [getPaymentMethodsQuery, {query: CURRENT_USER}];
                  }}
                >
                  {(createPaymentMethod, { loading, error, data }) => {

                    return (
                      <ListItem
                        key={'creditcard'}
                        onPress={() => this.handleCardPayPress(createPaymentMethod)}
                        {...testID('cardFormButton')}
                      >
                        <Body>
                          {creditCardLoading 
                            ? <ActivityIndicator size="small" color="grey" />
                            : <Text style={TypographyStyles.listSubItemTitle}>
                                Add a credit card
                              </Text>
                          }
                          {error && <GenericError message={error.message} />}
                        </Body>
                        <Right>
                          <Icon style={{fontSize: 26, color: Colors.BrandRed}} name="md-add" />
                        </Right>
                      </ListItem>
                    )
                  }}
                </Mutation>
            </Card>
          </View>

          {hasBilling
            ? this.getBalanceCard(Money.centsToUSD(currentUser.billing.balance))
            : null
          }

          <View style={{height: 40}}></View>
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
    const { currentUser } = this.props.currentUser;

    if (!currentUser.billing) return null;

    const { billing: { stripeCustomer } } = currentUser;

    return (
      <Query query={GET_PAYMENT_METHODS} variables={{ userId: currentUser._id }}>
        {({ loading, error, data }) => {
          if (loading) return (
            <View style={{margin: 15}}>
              <ActivityIndicator size="large" color={Colors.BrandRed} /> 
              <Text key="loading">Loading your payment methods...</Text>
            </View>
          )

          if (error) return (
            <Text key="error" style={{color: Colors.BrandRed, padding: 15}}>We could not load your payment methods at this time.</Text>
          )

          return data.paymentMethods.map(source => {
            const { selectedPaymentMethodSource } = this.state;
            let defaultSource = selectedPaymentMethodSource ? selectedPaymentMethodSource : stripeCustomer.default_source;
            const isSelected = defaultSource === source.id;

            return (
              <Mutation
                key={source.id}
                mutation={UPDATE_DEFAULT_PAYMENT_METHOD}
                refetchQueries={() => {
                  return [{query: GET_PAYMENT_METHODS, variables: { userId: currentUser._id }}, {query: GET_CURRENT_USER}];
                }}
              >
                {(updateDefaultPaymentMethod, {loading, error, data}) => {
                  return (
                    <ListItem
                      key={source.id} 
                      style={[isSelected ? CardStyles.cardListItemSelected : {}]} 
                      onPress={() => {
                        updateDefaultPaymentMethod({variables: { source: source.id }});
                        this.setState({ selectedPaymentMethodSource: source.id });
                      }}
                    >
                      <Body>
                        <Text style={[TypographyStyles.listSubItemTitle, isSelected ? TypographyStyles.listSubItemTitleSelected : {}]}>
                          XXXX XXXX XXXX {source.last4}
                        </Text>
                        {error && <GenericError message={error.message} />}
                      </Body>
                      <Right>
                        {isSelected ? <Icon style={{fontSize: 26, color: Colors.BrandRed}} name="md-checkmark" /> : null}
                      </Right>
                    </ListItem>
                  )
                }}
              </Mutation>
            )
          })
        }}
      </Query>
    )
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
              {error && <GenericError message={error.message} />}
            </CardItem>
          )
        }}
      </Mutation>
    )
  }

  getAmountOptions = () => {
    const amounts = [
      {label: '$10', value: 10.0},
      {label: '$15', value: 15.0},
      {label: '$20', value: 20.0},
      {label: '$25', value: 25.0},
      {label: '$30', value: 30.0},
      {label: '$35', value: 35.0},
      {label: '$40', value: 40.0},
      {label: '$45', value: 45.0},
      {label: '$50', value: 50.0},
      {label: '$75', value: 75.0},
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
  query paymentMethods($userId: String) {
    paymentMethods(userId: $userId) {
      id
      last4
    }
  }
`

const CURRENT_USER = gql`
{
  currentUser {
    _id
    email
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

export default compose(
  graphql(CURRENT_USER, {
     name: "currentUser"
  }),
  graphql(GET_PAYMENT_METHODS, {
     name: "paymentMethods"
  }),
)(PaymentManager);
