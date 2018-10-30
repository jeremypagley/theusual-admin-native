import React from 'react';
import { 
  Text,
} from 'native-base';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import OrderStatusStyles from 'app/styles/OrderStatusStyles';
import ExpandableCard from 'app/components/ExpandableCard';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import GET_ORDER_HISTORY from 'app/graphql/query/getOrderHistory';
import moment from 'moment';

class OrderHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{marginTop: 40}}>
        <Text style={[TypographyStyles.noteBold, {marginLeft: 15}]}>Previous orders</Text>
        <Query query={GET_ORDER_HISTORY}>
          {({ loading, error, data }) => {
            if (loading) return <LoadingIndicator title="Loading your previous orders" />;
            if (error) return <GenericError message={error.message} />;

            const { userOrderHistory } = data;

            if (!userOrderHistory.orderHistory && userOrderHistory.orderHistory.length < 1) {
              return this._getNoOrderItems();
            }

            return userOrderHistory.orderHistory.map(order => {
              return (
                <View key={order._id} style={{opacity: .5}}>
                  {this.getOrderProducts(order.items, moment(order.orderedDate).format('MM-DD-YY hh:m a'))}
                </View>
              )
            })
          }}
        </Query>
      </View>
    );
  }

  _getNoOrderItems = () => {
    return (
      <View style={OrderStatusStyles.noItemsWrapper}>
        <Text style={TypographyStyles.note}>No previous orders. Tap on Stores and order your first item!</Text>
      </View>
    );
  }

  getOrderProducts = (items, title) => {
    return items.map(item => {
      const combinedPrice = this.getCombinedPrices(item);
      let options = [];

      item.productModifiersOptions.forEach(mod => {
        options.push(mod.title)
      });

      options.push(`$${combinedPrice}`);

      return (
        <View key={item._id}>
          <ExpandableCard
            key={item._id}
            title={title}
            items={[{title: item.product.title, options}]}
          />
        </View>
      )
    });
  }

  getCombinedPrices = (item) => {
    let productPrice = item.product.price;
    let combinedPrice = productPrice;

    item.productModifiersOptions.forEach(mod => combinedPrice += mod.price);
    
    return Number.parseFloat(combinedPrice).toFixed(2);
  }

}

export default OrderHistory;
