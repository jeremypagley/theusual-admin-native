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
import moment from 'moment';
import CardList from 'app/components/CardList';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';

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

  getMenuCard = (store) => {
    return (
      <CardList
        data={this.getListData(store.productCategories)}
        handleItemPress={(item) => this.onItemPress(item, store.productCategories)}
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
    const currentTime = moment().valueOf();
    const storeHours = store.hours;

    const startTime = moment(storeHours.start).format('h:mm a');
    const endTime = moment(storeHours.end).format('h:mm a');

    const storeOpened = moment(currentTime).isBetween(storeHours.start, storeHours.end, 'hours');
    const openedTitle = storeOpened ? '' : '(Closed)';

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

  onItemPress = (item, productCategories) => {
    const { navigation } = this.props;
    const productCategory = productCategories.find(p => p._id === item._id);
    navigation.navigate('Products', { productCategory });
  }

}

// const StoresQuery = gql`
// {
//   stores {
//     _id,
//     title,
//     description,
//     hours,
//     phone,
//     website,
//     location {
//       address
//     },
//     productCategories {
//       title,
//       products
//     }
//   }
// }
// `

export default Store;
