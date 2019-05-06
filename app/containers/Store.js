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
  Button,
  Toast
} from 'native-base';
import { Alert, FlatList, Platform, Dimensions, SafeAreaView } from 'react-native';
import Time from 'app/utils/time';
import moment from 'moment';
import CardList from 'app/components/CardList';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import ButtonStyles from 'app/styles/generic/ButtonStyles';

import ExpandableCard from 'app/components/ExpandableCard';
import QueueStatus from 'app/constants/queueStatus';
import GET_ORGANIZATION_STORES from 'app/graphql/query/getOrganizationStores';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import StoreMenuContainer from 'app/containers/StoreMenu';
import { Audio, Constants, Notifications, Permissions } from 'expo';
import { graphql } from 'react-apollo';

const screenHeight = Dimensions.get('window').height;

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

class Store extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      previousPendingOrdersLength: null
    }
  }

  // Logic for local notification permission granting
  // componentWillMount() {
  //   getiOSNotificationPermission();
  //   this.listenForNotifications();
  // }

  listenForNotifications = () => {
    Notifications.addListener(notification => {
      if (notification.origin === 'received' && Platform.OS === 'ios') {
        Alert.alert(notification.title, notification.body);
      }
    });
  };

  /*
  // Logic for push notifications
  componentDidMount() {
    const { screenProps } = this.props;
    const { currentUser, loading, error } = this.props.data;
    const apolloClient = screenProps.client;
    const pnToken = PNHelper.registerForPushNotificationsAsync();
    console.log('pnTokenL: ', pnToken)

    
    if (!loading && !error && currentUser && currentUser._id && !currentUser.pushNotificationToken) {

      const updatedUser = Object.assign({}, currentUser, {pushNotificationToken: pnToken});

      // See backend schema as it only supports updating fields that you put in the UserInput
      const updateUser = gql`
        mutation updateUser($user: UserInput!) {
          updateUser(user: $user) {
            _id,
          }
        }
      `;


      apolloClient.mutate({mutation: updateUser, variables: {user: updatedUser}});
    }
  }
  */

  render() {
    const selectedStoreId = this.props.navigation.getParam('storeId', null);

    const manifest = Constants.manifest;
    const buildNumber = manifest.ios.buildNumber;
    const version = manifest.version;
    const releaseChannel = manifest.releaseChannel;

    return (
      <Container style={ContainerStyles.container}>
        <Query query={GET_ORGANIZATION_STORES} pollInterval={60000} variables={{storeId: selectedStoreId}} fetchPolicy="cache-and-network">
          {({ loading, error, data, refetch }) => {
            if (error) return <GenericError message={error.message} />;
            
            let activeOrdersNode = <LoadingIndicator title={`Refreshing Active Orders`} />;
            let orderHistoryNode = <LoadingIndicator title={`Refreshing Active Orders`} />;
            let menuNode = <LoadingIndicator title={`Refreshing Active Orders`} />;
            let aboutNode = <LoadingIndicator title={`Refreshing Active Orders`} />;

            let pnNode = null;

            if (data && data.organizationStores && !error) {
              const organization = data.organizationStores;
              const store = organization.stores.find(store => store._id === selectedStoreId);

              let pendingOrders = []
              store.orderQueue.forEach(o => {
                if (o.queueStatus === QueueStatus.pending) {
                  pendingOrders.unshift(o)
                }
              });
              // previousOrders is completed or canceled orders
              let previousOrders = []
              store.orderQueue.forEach(o => {
                if (o.queueStatus === QueueStatus.completed || o.queueStatus === QueueStatus.canceled) previousOrders.unshift(o)
              });

              /**
               * Handles carefully notifying foreground app with toast and sound
               */
              this.notifier(pendingOrders.length, store.title);

              if (pendingOrders.length < 1) {
                pendingOrders = [{type: 'noorders'}]
              }
              
              activeOrdersNode = (
                <SafeAreaView style={{backgroundColor: Colors.BrandLightGrey, height: screenHeight}}>
                  <FlatList
                    data={pendingOrders}
                    renderItem={({ item }) => {
                      if (item.type && item.type === 'noorders') return this.getNoDataCard('No active orders');
                      return this.getOrderQueueCard(item)
                    }}
                    onRefresh={() => refetch()}
                    refreshing={data.networkStatus === 4}
                    keyExtractor={this._keyExtractor}
                    contentContainerStyle={{marginBottom: 250, padding: 15}}
                  />
                </SafeAreaView>
              )

              orderHistoryNode = (
                <Content style={ContainerStyles.tabContent} padder>
                  {this.getTipSums(previousOrders)}

                  <Text style={[TypographyStyles.noteBold, {marginTop: 10}]}>This weeks previous orders</Text>
                  <View style={{opacity: 1}}>
                    {previousOrders.length > 0 ? previousOrders.map(order => {
                      let inWeek = moment(order.orderedDate).isSame(new Date(), 'week');
                      if (!inWeek) return null;
                      return this.getOrderQueueCard(order, false);
                    }) : null}
                  </View>
                  {!previousOrders.length > 0 ? this.getNoDataCard('No previous orders') : null}
                </Content>
              );

              aboutNode = this.getAboutCard(store);

              pnNode = store.pushNotificationToken || this.state.pushNotificationToken ? null : this.getPNActionNode(store, refetch);

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
                  {pnNode}
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
                  <Content style={ContainerStyles.tabContent} padder>
                    <StoreMenuContainer navigation={this.props.navigation} />
                  </Content>
                </Tab>

                <Tab 
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="About"
                >
                  <Content style={ContainerStyles.tabContent} padder>
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

  getPNActionNode = (store, refetch) => {
    return (
      <Mutation
        mutation={EDIT_STORE}
        onCompleted={(data) => {
          Toast.show({
            text: 'Store notifications activated 👍',
            buttonText: 'Great',
            duration: 3000,
            type: 'success',
            style: {
              backgroundColor: Colors.BrandBlack,
              color: Colors.White
            }
          });

          refetch();
        }}
      >
        {(editStore, { loading, error, data }) => {
          return (
            <Button 
              style={ButtonStyles.secondaryButton}
              onPress={() => this.registerForPushNotificationsAsync(store, editStore)}
            >
              <Text style={ButtonStyles.secondaryButtonText}>Activate store order notifications</Text>
            </Button>
            )
          }}
        </Mutation>
    )
  }

  registerForPushNotificationsAsync = async (store, callback) => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    console.log('=====finalStatus: ', finalStatus)
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    console.log('=====token: ', token)

    this.setState({pushNotificationToken: token});

    callback({variables: {storeId: store._id, categories: null, pushNotificationToken: token}});
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    // return fetch(PUSH_ENDPOINT, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     token: {
    //       value: token,
    //     },
    //     user: {
    //       username: 'Brent',
    //     },
    //   }),
    // });
  }

  getTipSums = (previousOrders) => {
    let weekSums = 0;
    let daySums = 0;

    previousOrders.forEach(order => {
      // let inMonth = moment('2010-01-01').isSame('2011-01-01', 'month'); // false, different year
      let inWeek = moment(order.orderedDate).isSame(new Date(), 'week');   // false, different month
      let inDay = moment(order.orderedDate).isSame(new Date(), 'day');   // false, different month

      if (inWeek && order.tip) weekSums += order.tip;
      if (inDay && order.tip) daySums += order.tip;
    });

    return (
      <View style={{marginTop: 10, marginBottom: 10}}>
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          <Text style={TypographyStyles.h3}>Weeks Tips: ${weekSums}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={TypographyStyles.h3}>Todays Tips: ${daySums}</Text>
        </View>
      </View>
    )
  }

  sendLocalNotification = (storeTitle) => {
    const localnotification = {
      title: `New Order`,
      body: `There are new orders for ${storeTitle}`,
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      },
    };
    let sendAfterFiveSeconds = Date.now();
    sendAfterFiveSeconds += 5000;

    const schedulingOptions = { time: sendAfterFiveSeconds };
    Notifications.scheduleLocalNotificationAsync(
      localnotification,
      schedulingOptions
    );
  };



 playNotificationSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('./sounds/graceful.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  notifier = (newPendingOrdersLength, storeTitle) => {
    let { previousPendingOrdersLength } = this.state;

    if (newPendingOrdersLength > previousPendingOrdersLength) {
      // Dont show on initial scene load
      if (previousPendingOrdersLength !== null) {
        Toast.show({
          text: 'New order',
          buttonText: 'Got it',
          duration: 3000,
        });


        // Note we are not sending local notifications as they dont show up in the lock screen.
        // we will need to rafactor stores in organizations to have unique users per store so that push notifications
        // for a new order can be sent only to users in an org for the store they are working at.
        // this.sendLocalNotification(storeTitle);
        this.playNotificationSound();
      }

      this.setState({previousPendingOrdersLength: newPendingOrdersLength});
    } else if (newPendingOrdersLength !== previousPendingOrdersLength) {
      this.setState({previousPendingOrdersLength: newPendingOrdersLength});
    }
  }

  _keyExtractor = (item, index) => item._id;

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

    const tipProps = {
      tipColor: Colors.BrandDarkGrey,
      tipTitle: order.tip ? `Tip: $${order.tip}` : 'No Tip'
    }

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
              let { previousPendingOrdersLength } = this.state;
              this.setState({previousPendingOrdersLength: previousPendingOrdersLength-- });
            },
            actionLoading: loading,
            actionLoadingTitle: 'Updating Status...',
            removable: true,
            removableOnPress: () => {
              Alert.alert(
                'Cancel Order', 
                `Are you sure you want to cancel this order? ` +
                'Canceled orders cannot be restored and do not issue a refund to the customer.',
                [
                  {text: 'OK', onPress: () => {
                    updateOrderQueueStatus({variables: {orderId: order._id, status: QueueStatus.canceled}});
                    let { previousPendingOrdersLength } = this.state;
                    this.setState({previousPendingOrdersLength: previousPendingOrdersLength-- });
                  }},
                  {text: "Cancel", style: 'cancel'}
                ]
              );
            }
          } : {};

          if (!order.orderedBy) return null;

          return (
            <ExpandableCard 
              key={order._id}
              title={
                <View>
                  <Text style={TypographyStyles.noteTitle}>{order.orderedBy.firstName} {order.orderedBy.lastName} </Text>
                  <Text style={TypographyStyles.noteTitle}>{moment(order.orderedDate).format('h:mm a MMM Do')}</Text>
                </View>
              }
              items={items}
              statusColor={statusColor}
              statusTitle={statusTitle}
              {...tipProps}
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

const UPDATE_USER = gql`
  mutation updateUser($pushNotificationToken: String!) {
    updateUser(pushNotificationToken: $pushNotificationToken) {
      _id,
    }
  }
`

const EDIT_STORE = gql`
  mutation editStore($storeId: String! $categories: [String], $pushNotificationToken: String) {
    editStore(storeId: $storeId, categories: $categories, pushNotificationToken: $pushNotificationToken) {
      _id,
    }
  }
`

export default Store;
