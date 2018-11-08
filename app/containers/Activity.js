import React from 'react';
import { 
  Container,
  Content,
  Header,
  View,
  Card,
  CardItem,
  Text,
  Left
} from 'native-base';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import GET_ORDER from 'app/graphql/query/getOrder';
import GET_CURRENT_USER from 'app/graphql/query/getCurrentUser';

import ExpandableCard from 'app/components/ExpandableCard';
import ContainerStyles from 'app/styles/generic/ContainerStyles';

import LoadingIndicator from 'app/components/LoadingIndicator';
import DeviceEmitters from 'app/utils/deviceEmitters';
import CardStyles from 'app/styles/generic/CardStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import GradientButton from 'app/components/GradientButton';
import GET_ORGANIZATION from '../graphql/query/getOrganization';

class ActivityContainer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      hasActiveOrder: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser } = nextProps.data;

    // When app loads add order bubble if there is an active order
    if (currentUser && currentUser.order && currentUser.order._id && currentUser.order.items && currentUser.order.items.length > 0 && !this.state.hasActiveOrder) {
      DeviceEmitters.activeOrderEventEmit(true);
      this.setState({ hasActiveOrder: true });
    }
  }

  render() {
    const { organization, loading } = this.props.data;
    const noData = organization && organization.stores.length === 0;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}></Header>

        <Content padder style={ContainerStyles.content}>
          {this.getNoDataCard(noData)}
          {loading ? <LoadingIndicator title="Loading active orders" /> : null}

          {/* {currentUser.usuals.map(usual => {
            if (usual.deleted) return null;
            return this.getUsualCard(usual, createOrderByUsualId, removeUsualById);
          })} */}

          <View style={{height: 30}}></View>
        </Content>
      </Container>
    );
  }

  getNoDataCard = (noData) => {
    return noData ? (
      <View>
        <View style={CardStyles.card}>
          <Card transparent>
            <CardItem header style={CardStyles.itemHeader}>
              <Left>
                <Text style={TypographyStyles.listTitle}>No Orders Currently</Text>
              </Left>
            </CardItem>
          </Card>
        </View>

        <GradientButton 
          title="Manual Refresh"
          // buttonProps={{onPress: () => this.props.navigation.navigate('Stores')}}
        />
      </View>
    ) : null;
  }

  getUsualCard = (usual, createOrderByUsualId, removeUsualById) => {
    const usualItems = usual.items;

    const items = usualItems.map(item => {
      const options = this.getUsualOptions(item);      
      return {title: item.product.title, options: options}
    });

    if (!usual.store.location) return null;

    return (
      <ExpandableCard 
        key={usual._id}
        title={usual.store.location.address}
        actionTitle="Add order"
        items={items}
        removable
        removableOnPress={() => removeUsualById({variables: {id: usual._id}})}
        onActionPress={() => {
          createOrderByUsualId({variables: {id: usual._id}});
          DeviceEmitters.activeOrderEventEmit(true);
        }}
      />
    )
  }

  getUsualOptions = (item) => {
    let options = [];
    const combinedPrice = this.getCombinedPrices(item);

    item.productModifiersOptions.forEach(mod => {
      options.push(mod.title)
    });

    options.push(`$${combinedPrice}`);

    return options
  }

  getCombinedPrices = (item) => {
    let productPrice = item.product.price;
    let combinedPrice = productPrice;

    item.productModifiersOptions.forEach(mod => combinedPrice += mod.price);
    
    return Number.parseFloat(combinedPrice).toFixed(2);
  }

}

const ADD_ORDER_BY_ID = gql`
  mutation createOrderByUsualId($id: String!) {
    createOrderByUsualId(id: $id) {
      _id
    }
  }
`

const REMOVE_USUAL_BY_ID = gql`
  mutation removeUsualById($id: String!) {
    removeUsualById(id: $id) {
      _id
    }
  }
`

export default ActivityContainer
