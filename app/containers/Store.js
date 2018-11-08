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

class Store extends React.Component {
  render() {
    const store = this.props.navigation.getParam('store', null);

    return (
      <Container style={ContainerStyles.container}>
        <Tabs tabBarUnderlineStyle={ContainerStyles.tabBarUnderline}>
          <Tab
            tabStyle={ContainerStyles.tab} 
            activeTabStyle={ContainerStyles.activeTab}
            textStyle={ContainerStyles.tabText}
            activeTextStyle={ContainerStyles.activeTabText}
            heading="Active Orders"
          >
            <Content padder>
              {/* {this.getOrderQueue(store.orderQueue)} */}
              {store.orderQueue.map(order => {
                // if (usual.deleted) return null;
                return this.getOrderQueueCard(order);
              })}
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
              {/* {this.getAboutCard(store)} */}
              <Text>TODO: THIS WILL SHOW ALL ORDER HISTORY 
                AND THEIR queueStatus WHICH IS SAME AS ACTIVEORDERS JUST CHANGE DOT COLOR AND GRAY THEM OUT A LITTLE</Text>
            </Content>
          </Tab>
        </Tabs>

          <Tab
            tabStyle={ContainerStyles.tab} 
            activeTabStyle={ContainerStyles.activeTab}
            textStyle={ContainerStyles.tabText}
            activeTextStyle={ContainerStyles.activeTabText}
            heading="Menu"
          >
            <Content padder>
              {this.getMenuCard(store)}
            </Content>
          </Tab>
          {/* <Tab
            tabStyle={ContainerStyles.tab} 
            activeTabStyle={ContainerStyles.activeTab}
            textStyle={ContainerStyles.tabText}
            activeTextStyle={ContainerStyles.activeTabText}
            heading="Locations"
          >
            <Text>TODO: Figure out way to get related stores on a store for the locations...</Text>
          </Tab> */}
          <Tab 
            tabStyle={ContainerStyles.tab} 
            activeTabStyle={ContainerStyles.activeTab}
            textStyle={ContainerStyles.tabText}
            activeTextStyle={ContainerStyles.activeTabText}
            heading="About"
          >
            <Content padder>
              {this.getAboutCard(store)}
            </Content>
          </Tab>
        </Tabs>
      </Container>
    );
  }

  // getOrderQueue = (orderQueue) => {
  //   return orderQueue.map(order => {
  //   // console.log('orderQueue order: ', order)

  //     return order.items.map(item => {
  //       console.log('item: ', item)
  //       return <View></View>
  //     })
  //   })
  // }

  getOrderQueueCard = (order) => {
    const orderItems = order.items;

    const items = orderItems.map(item => {
      const options = this.getOrderOptions(item);      
      return {title: item.product.title, options: options}
    });

    return (
      <ExpandableCard 
        key={order._id}
        title={`Ordered by: ${order.orderedBy.firstName} ${order.orderedBy.lastName}    Ordered at: ${moment(order.orderedDate).format('h:mm a dd')}`}
        actionTitle="Unsure??"
        items={items}
        // removable
        // removableOnPress={() => removeUsualById({variables: {id: usual._id}})}
        // onActionPress={() => {
        //   createOrderByUsualId({variables: {id: usual._id}});
        //   DeviceEmitters.activeOrderEventEmit(true);
        // }}
      />
    )
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

  onItemPress = (item, productCategories, unavailableProducts) => {
    const { navigation } = this.props;
    const productCategory = productCategories.find(p => p._id === item._id);
    navigation.navigate('Products', { productCategory, unavailableProducts });
  }

}

export default Store;
