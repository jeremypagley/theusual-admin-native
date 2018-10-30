import React from 'react';
import { 
  Container,
  Content,
  Header,
  View
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

class UsualsContainer extends React.Component {
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
    const { currentUser, loading } = this.props.data;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}></Header>

        <Content padder style={ContainerStyles.content}>
          <Mutation 
            mutation={ADD_ORDER_BY_ID}
            refetchQueries={() => {
              return [{
                query: GET_ORDER,
              }];
            }}
          >
            {(createOrderByUsualId, { data }) => (
              <Mutation 
                mutation={REMOVE_USUAL_BY_ID}
                refetchQueries={() => {
                  return [{
                      query: GET_CURRENT_USER,
                  }];
                }}
              >
              {(removeUsualById, { data }) => {
                  if (loading) {
                    return <LoadingIndicator title="Loading your usuals" />;
                  }

                  return currentUser.usuals.map(usual => {
                    if (usual.deleted) return null;
                    return this.getUsualCard(usual, createOrderByUsualId, removeUsualById);
                  })
                }}
              </Mutation>
            )}
          </Mutation>

          <View style={{height: 30}}></View>
        </Content>
      </Container>
    );
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

export default graphql(GET_CURRENT_USER)(UsualsContainer);
