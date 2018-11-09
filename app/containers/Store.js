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
  Content
} from 'native-base';
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
    const selectedStore = this.props.navigation.getParam('store', null);

    return (
      <Container style={ContainerStyles.container}>
        <Query query={GET_ORGANIZATION_STORES}>
          {({ loading, error, data }) => {
            if (error) return <GenericError message={error.message} />;
            const organization = !loading ? data.organizationStores : null;
            const store = !loading ? organization.stores.find(s => s._id === selectedStore._id) : selectedStore;

            const pendingOrders = []
            store.orderQueue.forEach(o => {
              if (o.queueStatus === QueueStatus.pending) pendingOrders.push(o)
            });
            const otherOrders = []
            store.orderQueue.forEach(o => {
              if (o.queueStatus === QueueStatus.completed || o.queueStatus === QueueStatus.canceled) otherOrders.push(o)
            });

            return (
              <Tabs tabBarUnderlineStyle={ContainerStyles.tabBarUnderline}>
                <Tab
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Active Orders"
                >
                  <Content padder>
                    {loading ? <LoadingIndicator title={`Loading ${store.title}`} /> 
                    : <View>
                        {pendingOrders.length > 0 ? pendingOrders.map(order => {
                          return this.getOrderQueueCard(order);
                        }) : null}
                      </View>
                    }
                    {!pendingOrders.length > 0 ? this.getNoDataCard('No active orders') : null}
                  </Content>
                </Tab>

                <Tab 
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Order History"
                >
                  <Content padder>
                    {loading ? <LoadingIndicator title={`Loading ${store.title}`} /> 
                    : <View style={{opacity: 0.6}}>
                        {otherOrders.length > 0 ? otherOrders.map(order => {
                          return this.getOrderQueueCard(order, false);
                        }) : null}
                      </View>
                    }
                    {!otherOrders.length > 0 ? this.getNoDataCard('No previous orders') : null}
                  </Content>
                </Tab>

                <Tab
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Menu"
                >
                  <Content padder>
                    {loading ? <LoadingIndicator title={`Loading ${store.title}`} /> : this.getMenuCard(store)}
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
                    {loading ? <LoadingIndicator title={`Loading ${store.title}`} /> : this.getAboutCard(store)}
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

    return (
      <Mutation
        mutation={UPDATE_ORDER_QUEUE_STATUS}
        refetchQueries={(data) => {
          return [{query: GET_ORGANIZATION_STORES}];
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
            removableOnPress: () => updateOrderQueueStatus({variables: {orderId: order._id, status: QueueStatus.canceled}})
          } : {};

          return (
            <ExpandableCard 
              key={order._id}
              title={`Ordered by: ${order.orderedBy.firstName} ${order.orderedBy.lastName}    Ordered at: ${moment(order.orderedDate).format('h:mm a dd')}`}
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
        handleItemPress={(item) => this.onItemPress(item, store.productCategories, store.unavailableProducts)}
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

  onItemPress = (item, productCategories, unavailableProducts) => {
    const { navigation } = this.props;
    const productCategory = productCategories.find(p => p._id === item._id);
    navigation.navigate('Products', { productCategory, unavailableProducts });
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
