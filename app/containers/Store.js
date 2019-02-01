import React from 'react';
import { 
  Container,
  Text,
  Body,
  View,
  Tabs,
  Tab,
  Card,
  CardItem,
  Content,
  Button
} from 'native-base';
import { Alert } from 'react-native';
import Time from 'app/utils/time';
import moment from 'moment';
import CardList from 'app/components/CardList';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import ExpandableCard from 'app/components/ExpandableCard';
import QueueStatus from 'app/constants/queueStatus';
import GET_ORGANIZATION_STORES from 'app/graphql/query/getOrganizationStores';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';

class Store extends React.Component {
  render() {
    const selectedStoreId = this.props.navigation.getParam('storeId', null);

    return (
      <Container style={ContainerStyles.container}>
        <Query query={GET_ORGANIZATION_STORES} pollInterval={30000} variables={{storeId: selectedStoreId}} fetchPolicy="cache-and-network">
          {({ loading, error, data }) => {
            if (error) return <GenericError message={error.message} />;
            
            let activeOrdersNode = <LoadingIndicator title={`Refreshing Active Orders`} />;
            let orderHistoryNode = <LoadingIndicator title={`Refreshing Active Orders`} />;
            let menuNode = <LoadingIndicator title={`Refreshing Active Orders`} />;
            let aboutNode = <LoadingIndicator title={`Refreshing Active Orders`} />;

            if (data && !loading && !error) {
              const organization = data.organizationStores;
              const store = organization.stores.find(store => store._id === selectedStoreId);

              const pendingOrders = []
              store.orderQueue.forEach(o => {
                if (o.queueStatus === QueueStatus.pending) pendingOrders.unshift(o)
              });
              // previousOrders is completed or canceled orders
              let previousOrders = []
              store.orderQueue.forEach(o => {
                if (o.queueStatus === QueueStatus.completed || o.queueStatus === QueueStatus.canceled) previousOrders.unshift(o)
              });

              activeOrdersNode = (
                <Content padder>
                  <View>
                    {pendingOrders.length > 0 ? pendingOrders.map(order => {
                      return this.getOrderQueueCard(order);
                    }) : null}
                  </View>
                  {!pendingOrders.length > 0 ? this.getNoDataCard('No active orders') : null}
                </Content>
              );

              orderHistoryNode = (
                <Content padder>
                  <View style={{opacity: 0.6}}>
                    {previousOrders.length > 0 ? previousOrders.map(order => {
                      return this.getOrderQueueCard(order, false);
                    }) : null}
                  </View>
                  {!previousOrders.length > 0 ? this.getNoDataCard('No previous orders') : null}
                </Content>
              );

              menuNode = this.getMenuCard(store);
              aboutNode = this.getAboutCard(store);

            }

            return (
              <Tabs tabBarUnderlineStyle={ContainerStyles.tabBarUnderline}>
                <Tab
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Active Orders"
                >
                  {activeOrdersNode}
                </Tab>

                <Tab 
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Order History"
                >
                  {orderHistoryNode}
                </Tab>

                <Tab
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Menu"
                >
                  <Content padder>
                    {menuNode}
                  </Content>
                </Tab>

                <Tab 
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="About"
                >
                  <Content padder>
                    {aboutNode}
                  </Content>
                </Tab>
              </Tabs>
            )
          }}
        </Query>
      </Container>
    );
  }

  getOrderQueueCard = (order, hasActions = true) => {
    const orderItems = order.items;

    const items = orderItems.map(item => {
      const options = this.getOrderOptions(item);      
      return {title: item.product.title, options: options}
    });

    let statusColor = null;
    let statusTitle = null;

    if (order.queueStatus === QueueStatus.pending) {
      statusColor = Colors.BrandOrange;
      statusTitle = QueueStatus.pending;
    }
    else if (order.queueStatus === QueueStatus.completed) {
      statusColor = Colors.BrandGreen;
      statusTitle = QueueStatus.completed;

    }
    else if (order.queueStatus === QueueStatus.canceled) {
      statusColor = Colors.BrandRed;
      statusTitle = QueueStatus.canceled;
    }

    const selectedStoreId = this.props.navigation.getParam('storeId', null);

    return (
      <Mutation
        key={order._id}
        mutation={UPDATE_ORDER_QUEUE_STATUS}
        refetchQueries={(data) => {
          return [{query: GET_ORGANIZATION_STORES, variables: { storeId: selectedStoreId }}];
        }}
      >
        {(updateOrderQueueStatus, { loading, error, data }) => {
          const actionProps = hasActions 
          ? {
            actionTitle: "Complete Order",
            onActionPress: () => {
              updateOrderQueueStatus({variables: {orderId: order._id, status: QueueStatus.completed}});
            },
            removable: true,
            removableOnPress: () => {
              Alert.alert(
                'Cancel Order', 
                `Are you sure you want to cancel this order? ` +
                'Canceled orders cannot be restored and do not issue a refund to the user.',
                [
                  {text: 'OK', onPress: () => updateOrderQueueStatus({variables: {orderId: order._id, status: QueueStatus.canceled}})},
                  {text: "Cancel", style: 'cancel'}
                ]
              );
            }
          } : {};

          return (
            <ExpandableCard 
              key={order._id}
              title={`Ordered by: ${order.orderedBy.firstName} ${order.orderedBy.lastName}    Ordered On: ${moment(order.orderedDate).format('h:mm a MMM Do')}`}
              items={items}
              statusColor={statusColor}
              statusTitle={statusTitle}
              {...actionProps}
            />
          )
        }}
      </Mutation>
    );
  }

  getOrderOptions = (item) => {
    let options = [];
    const combinedPrice = this.getCombinedPrices(item);

    item.productModifiersOptions.forEach(mod => {
      options.push(mod.title)
    });

    options.push(`$${combinedPrice}`);

    return options;
  }

  getCombinedPrices = (item) => {
    let productPrice = item.product.price;
    let combinedPrice = productPrice;

    item.productModifiersOptions.forEach(mod => combinedPrice += mod.price);
    
    return Number.parseFloat(combinedPrice).toFixed(2);
  }

  getMenuCard = (store) => {
    return (
      <CardList
        data={this.getListData(store.productCategories)}
        handleItemPress={(item) => this.onItemPress(item, store)}
      />
    )
  }

  getListData = (productCategories) => {
    return productCategories.map((productCategory) => {
      return {
        _id: productCategory._id,
        title: productCategory.title,
      }
    })
  }

  getAboutCard = (store) => {
    const storeHours = store.hours;

    const startTime = moment(storeHours.start).format('h:mm a');
    const endTime = moment(storeHours.end).format('h:mm a');
    const storeOpened = Time.getStoreOpened(storeHours);
    const openedTitle = storeOpened ? '(Open)' : '(Closed)';

    return (
      <View style={CardStyles.card}>
        <Card transparent>
          <CardItem header style={CardStyles.itemHeader}>
            <Text style={TypographyStyles.listTitle}>About</Text>
          </CardItem>

          <CardItem>
            <Body>
              <Text style={TypographyStyles.note}>{store.description}</Text>
            </Body>
          </CardItem>

          <CardItem footer style={CardStyles.itemFooter}>
            <Body>
              <Text style={TypographyStyles.note}>Hours: {startTime} - {endTime} {openedTitle}</Text>
              <Text style={TypographyStyles.note}>Phone: {store.phone}</Text>
              <Text style={TypographyStyles.note}>Website: {store.website}</Text>
            </Body>
          </CardItem>
        </Card>
      </View>
    )
  }

  getNoDataCard = (title) => {
    return (
      <View>
        <View style={CardStyles.card}>
          <Card transparent>
            <CardItem>
              <Body>
                <Text style={TypographyStyles.noteEmphasize}>{title}</Text>
              </Body>
            </CardItem>
          </Card>
        </View>

        {/* <GradientButton 
          title="Manual Refresh"
          // buttonProps={{onPress: () => this.props.navigation.navigate('Stores')}}
        /> */}
      </View>
    );
  }

  onItemPress = (item, store) => {
    const { navigation } = this.props;
    const productCategory = store.productCategories.find(p => p._id === item._id);
    navigation.navigate('Products', { productCategory, storeId: store._id });
  }

}

const UPDATE_ORDER_QUEUE_STATUS = gql`
  mutation updateOrderQueueStatus($orderId: String!, $status: String!) {
    updateOrderQueueStatus(orderId: $orderId, status: $status) {
      _id,
    }
  }
`

export default Store;
