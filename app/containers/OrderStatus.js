import React from 'react';
import { 
  Text,
  Button,
  Header,
  Container,
  Body,
  Content,
  Card,
  CardItem,
  Left
} from 'native-base';
import { View } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import OrderStatusStyles from 'app/styles/OrderStatusStyles';
import ExpandableCard from 'app/components/ExpandableCard';
import GET_ORDER from 'app/graphql/query/getOrder';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import PaymentManager from 'app/containers/PaymentManager';
import CardForm from 'app/components/stripe/CardForm';
import Money from 'app/utils/money';
import Time from 'app/utils/time';
import GradientButton from 'app/components/GradientButton';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import OrderHistory from 'app/containers/OrderHistory';
import DeviceEmitters from 'app/utils/deviceEmitters';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import ButtonStyles from 'app/styles/generic/ButtonStyles';
import GET_ORDER_HISTORY from 'app/graphql/query/getOrderHistory';

class OrderStatus extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      token: '',
      errorInsufficientFunds: false,
      displayPaymentManagerModal: false
    }
  }

  render() {
    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}></Header>

        <Content padder style={ContainerStyles.content}>
          {this.getPaymentManagerCard()}
          
          <Query query={GET_ORDER}>
            {({ loading, error, data }) => {
              if (loading) return <LoadingIndicator title="Loading your order items" />;
              if (error) return <GenericError message={error.message} />;

              const order = data.order && data.order[0] ? data.order[0] : null;

              if (!order || order.items.length < 1) return (
                <View>
                  <Text style={[TypographyStyles.noteBold, {marginLeft: 15}]}>Added products</Text>
                  {this._getNoOrderItems()}
                </View>
              )

              return (
                <View>
                  {this.getOrderingFromStoreInfoCard(order)}

                  <Text style={[TypographyStyles.noteBold, {marginLeft: 15}]}>Added products</Text>
                  {this.renderContent(order)}
                </View>
              );
            }}
          </Query>

          <OrderHistory />

          <View style={{height: 30}}></View>
        </Content>
      </Container>
    );

  }

  getOrderingFromStoreInfoCard = (order) => {
    if (!order.store.location) return null
    
    return (
      <View style={[CardStyles.card, {marginBottom: 25}]}>
        <Card transparent>
          <CardItem header style={CardStyles.itemHeader}>
            <Text style={TypographyStyles.listTitle}>Ordering from {order.store.title}</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text style={TypographyStyles.note}>{order.store.location.address}</Text>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  }
  
  getPaymentManagerCard = () => {
    const { currentUser, loading, error } = this.props.data;
    if (loading) return <LoadingIndicator title="Loading your payment info" />;
    if (error) return <GenericError message={error.message} />;

    const hasBilling = currentUser.billing;

    const balance = hasBilling ? Money.centsToUSD(currentUser.billing.balance) : null;
    let title = 'Your balance';

    if (!hasBilling) title = 'Need payment method to order';

    return (
      <View style={[CardStyles.card, {marginBottom: 10}]}>
        <Card transparent>
          <CardItem header style={CardStyles.itemHeader}>
            <Text style={TypographyStyles.listTitle}>{title}</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text style={TypographyStyles.noteEmphasize}>{balance}</Text>
            </Body>
          </CardItem>

          {/*This is a CardItem of type footer */}
          <PaymentManager open={this.state.displayPaymentManagerModal} onModalToggle={this.togglePaymentManagerModal} />
        </Card>
      </View>
    );
  }

  getPaymentManager = () => {
    return <PaymentManager open={this.state.displayPaymentManagerModal} onModalToggle={this.togglePaymentManagerModal} />
  }

  togglePaymentManagerModal = () => {
    const { displayPaymentManagerModal } = this.state;
    this.setState({ displayPaymentManagerModal: !displayPaymentManagerModal })
  }

  renderContent = (order) => {
    const { currentUser } = this.props.data;
    if (!currentUser) return;

    const hasBilling = currentUser.billing;

    const insufficientFunds = hasBilling ? this.getCombinedPricesInCents(order.items) > currentUser.billing.balance : null;
    const storeHours = order.store.hours;
    const storeOpened = Time.getStoreOpened(storeHours);
    const disabled = storeOpened && hasBilling ? false : true;
    let title = storeOpened ? 'Confirm Order' : 'Store Closed';

    if (!hasBilling) title = 'Add payment method above to order'

    return (
      <View>
        {this.getOrderProducts(order.items)}

        {!insufficientFunds ?
        <View>
          <Mutation 
            mutation={CONFIRM_ORDER}
            refetchQueries={() => {
              return [{query: GET_ORDER}, {query: GET_ORDER_HISTORY}];
            }}
          >
            {(confirmOrder, { loading, error }) => {
              return (
                <View style={{marginTop: 4}}>
                  <GradientButton 
                    title={title}
                    disabled={disabled}
                    buttonProps={{
                      onPress: () => {
                        if (!disabled) {
                          confirmOrder();
                          DeviceEmitters.activeOrderEventEmit(false);
                        }
                      }
                    }}
                  />
                  {error && <GenericError message={error.message} />}
                </View>
              )
            }}
          </Mutation>
        </View>
        : null}
        {insufficientFunds ? this.getInsufficientFunds() : null}
        
        <View>
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
                block 
                style={ButtonStyles.secondaryButton}
                onPress={() => createUsualByOrderId({variables: {id: order._id}})}
              >
                <Text style={ButtonStyles.secondaryButtonText}>Add order to usuals</Text>
              </Button>
            )}
          </Mutation>
        </View>
      </View>
    );
  }

  getInsufficientFunds = () => {
    return (
      <View style={OrderStatusStyles.noItemsWrapper}>
        <Text style={OrderStatusStyles.title}>Not enough funds 😕 Reload to finish your order.</Text>
      </View>
    );
  }

  getAddPayment = () => {
    return (
      <CardForm handleCardPayPress={token => this.setState({token: token})} />
    );
  }

  _getNoOrderItems = () => {
    return (
      <View style={OrderStatusStyles.noItemsWrapper}>
        <Text style={TypographyStyles.note}>No order items have been added 😕</Text>
      </View>
    )
  }

  getOrderProducts = (items) => {

    return items.map(item => {
      const combinedPrice = this.getCombinedPrices(item);
      let options = [];

      item.productModifiersOptions.forEach(mod => {
        options.push(mod.title)
      });

      options.push(`$${combinedPrice}`);

      return (
        <View key={item._id}>
          <Mutation 
            mutation={REMOVE_ORDER_ITEM}
            refetchQueries={() => {
              return [{
                 query: GET_ORDER,
              }];
            }}
          >
            {(removeOrderItem, { data }) => (
              <ExpandableCard 
                items={[{title: item.product.title, options}]}
                removable
                removableOnPress={() => {
                  removeOrderItem({variables: {id: item._id}});
                  
                  // Items has one item on a remove if it's the last item being removed
                  if (items.length === 1) DeviceEmitters.activeOrderEventEmit(false);
                }}
              />
            )}
          </Mutation>
        </View>
      )
    });
  }

  getCombinedPricesInCents = (items) => {
    if (!items) return;

    let totalPrice = 0;
    items.forEach(item => {
      totalPrice += this.getCombinedPrices(item);
    });

    let adjustedTotal = totalPrice * 100;

    return adjustedTotal;
  }

  getCombinedPrices = (item) => {
    let productPrice = item.product.price;
    let combinedPrice = productPrice;

    item.productModifiersOptions.forEach(mod => combinedPrice += mod.price);
    
    return Number.parseFloat(combinedPrice).toFixed(2);
  }

}

const REMOVE_ORDER_ITEM = gql`
  mutation removeOrderItem($id: String!) {
    removeOrderItem(id: $id) {
      _id
    }
  }
`

const CONFIRM_ORDER = gql`
  mutation confirmOrder {
    confirmOrder {
      _id
    }
  }
`

const CREATE_USUAL = gql`
  mutation createUsualByOrderId($id: String!) {
    createUsualByOrderId(id: $id) {
      _id
    }
  }
`

export default graphql(
  gql`
    query User {
      currentUser {
        _id
        billing {
          balance
        }
      }
    }
  `
)(OrderStatus);
