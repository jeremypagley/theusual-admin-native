import React from 'react';
import { 
  Text,
  Button,
  H1,
  H3,
  Fab,
  Header,
  Container,
  Body,
  Content,
  Card,
  CardItem,
} from 'native-base';
import { View } from 'react-native';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import OrderStatusStyles from 'app/styles/OrderStatusStyles';
import Colors from 'app/styles/Colors';
import ExpandableCard from 'app/components/ExpandableCard';
import GET_ORDER from 'app/graphql/query/getOrder';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';
import PaymentManager from 'app/containers/PaymentManager';
import CardForm from 'app/components/stripe/CardForm';
import Money from 'app/utils/money';
import GradientButton from 'app/components/GradientButton';

import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import ButtonStyles from 'app/styles/generic/ButtonStyles';

class OrderStatus extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      token: '',
      errorInsufficientFunds: false
    }
  }

  render() {
    const { currentUser } = this.props.data;
    if (!currentUser) return null;

    const balance = Money.centsToUSD(currentUser.billing.balance);

    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}></Header>

        <Content padder style={ContainerStyles.content}>
          <View style={CardStyles.card}>
            <Card transparent>
              <CardItem header style={CardStyles.itemHeader}>
                <Text style={TypographyStyles.listTitle}>Ordering from {currentUser.order.store.title}</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={TypographyStyles.note}>{currentUser.order.store.location.address}</Text>
                </Body>
              </CardItem>
            </Card>
          </View>

          <View style={[CardStyles.card, {marginBottom: 40}]}>
            <Card transparent>
              <CardItem header style={CardStyles.itemHeader}>
                <Text style={TypographyStyles.listTitle}>Your balance</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={TypographyStyles.noteEmphasize}>{balance}</Text>
                </Body>
              </CardItem>

              {/*This is a CardItem of type footer */}
              <PaymentManager />
            </Card>
          </View>
          
          <Text style={TypographyStyles.noteBold}>Added products</Text>
          <Query query={GET_ORDER}>
            {({ loading, error, data }) => {
              if (error) return <View><Text>Error</Text></View>;
              let items = [];

              if (data.order && data.order.length > 0) {
                items = data.order[0].items;
              } else {
                items = [];
              }

              return (<View>{this.renderContent(items)}</View>);
            }}
          </Query>
        </Content>
      </Container>
    );

  }

  renderContent = (items) => {
    const { currentUser } = this.props.data;
    if (!currentUser) return;

    const hasBilling = currentUser.billing;
    const noOrderItems = items.length < 1;

    const insufficientFunds = this.getCombinedPricesInCents(items) > currentUser.billing.balance;

    return (
      <View>
        {this.getOrderProducts(items, noOrderItems)}

        {!noOrderItems && hasBilling && !insufficientFunds ?
        <View>
          <Mutation 
            mutation={CONFIRM_ORDER}
            refetchQueries={() => {
              return [{
                  query: GET_ORDER,
              }];
            }}
          >
            {confirmOrder => (
              <GradientButton 
                title="Confirm order"
                buttonProps={{
                  onPress: () => confirmOrder()
                }}
              />
            )}
          </Mutation>
        </View>
        : null}
        {insufficientFunds ? this.getInsufficientFunds() : null}
        
        {!noOrderItems ?
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
                onPress={() => createUsualByOrderId({variables: {id: currentUser.order}})}
              >
                <Text style={ButtonStyles.secondaryButtonText}>Add order to usuals</Text>
              </Button>
            )}
          </Mutation>
        </View>
        : null}
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

  getOrderProducts = (items, noOrderItems) => {

    if (noOrderItems) return (
      <View style={OrderStatusStyles.noItemsWrapper}>
        <H3>No order items have been added 😕</H3>
      </View>
    )

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
                removableOnPress={() => removeOrderItem({variables: {id: item._id}})}
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
        email
        order {
          _id
          store {
            _id
            title
            location {
              address
            }
          }
        }
        billing {
          balance
        }
      }
    }
  `
)(OrderStatus);
