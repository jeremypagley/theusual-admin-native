import React from 'react';
import { 
  Container,
  Body,
  ListItem,
  Accordion,
  Right,
  Left,
  View,
  Text,
  Content,
  Header,
  Card,
  CardItem,
  Icon,
  Button
} from 'native-base';
import { TouchableOpacity } from 'react-native';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import GET_ORDER from 'app/graphql/query/getOrder';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import ButtonStyles from 'app/styles/generic/ButtonStyles';
import Colors from 'app/styles/Colors';
import GradientButton from 'app/components/GradientButton';
import DeviceEmitters from 'app/utils/deviceEmitters';
import GET_ORGANIZATION_STORES from 'app/graphql/query/getOrganizationStores';
import GET_PRODUCTS from '../graphql/query/getProducts';

class Product extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addedModifiers: {}
    }
  }

  render() {
    const product = this.props.navigation.getParam('product', null);
    const modifiersArray = this.getModifiersDataArray(product.productModifiers);

    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}></Header>

        <Content padder style={ContainerStyles.content}>
          <View style={CardStyles.card}>
            <Card transparent>
              <CardItem header style={CardStyles.itemHeader}>
                <Text style={TypographyStyles.listTitle}>About</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={TypographyStyles.note}>{product.description}</Text>
                </Body>
              </CardItem>
            </Card>
          </View>
          <View style={CardStyles.card}>
            <Card transparent>
              <Accordion
                style={{borderWidth: 0}}
                dataArray={modifiersArray}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
              />
            </Card>
          </View>

          {/* {this.getAddItemButton(product)} */}
          {this.getMarkAsUnavailableButton(product)}
        </Content>
      </Container>
    );
  }

  getAddItemButton = (product) => {
    const productModifiersOptions = this.getOrderItemMappedData();
    const productId = product._id;
    const storeId = product.store._id;
    
    return (
      <Mutation 
        mutation={CREATE_ORDER_ITEM}
        refetchQueries={() => {
          return [{query: GET_ORDER}, {query: GET_PRODUCTS}];
        }}
      >
         {createOrderItem => (
          <GradientButton 
            title="Add to order"
            buttonProps={{
              onPress: () => {
                createOrderItem({variables: {productId, productModifiersOptions, storeId}});
                DeviceEmitters.activeOrderEventEmit(true);
              }
            }}
          />
        )}
      </Mutation>
    );
  }

  getMarkAsUnavailableButton = (product) => {
    const productId = product._id;
    const unavailable = this.props.navigation.getParam('unavailable', null);
    const selectedStoreId = this.props.navigation.getParam('storeId', null);

    let title = unavailable ? 'Mark As Available' : 'Mark as Unavailable';

    return (
      <Mutation 
        mutation={UPDATE_PRODUCT_AVAILABILITY}
        refetchQueries={() => {
          return [{
             query: GET_ORGANIZATION_STORES,
             variables: { storeId: selectedStoreId }
          }];
        }}
      >
        {(updateProductAvailability, { loading, error, data }) => {          
          if (data) {
            let unavailableProducts = data.updateProductAvailability.unavailableProducts;
            const unavailableAfterUpdate = unavailableProducts.find(p => p._id === productId)

            title = unavailableAfterUpdate ? 'Mark As Available' : 'Mark as Unavailable';
          }

          return (
            <GradientButton 
              title={title} 
              buttonProps={{
                onPress: () => {
                  updateProductAvailability({variables: {productId, storeId: selectedStoreId}})
                }
              }}
            />
          )
        }}
      </Mutation>
    );
  }

  _renderHeader = (item, expanded) => {
    const hasModifierOptions = this.state.addedModifiers[item.modifier._id];

    return (
      <View style={CardStyles.accordionCardInner}>
        <Left>
          <Text style={TypographyStyles.listItemTitle}>
            {" "}{item.title}
          </Text>
      
          {this.getAddedModifiersOptions(item.modifier)}
        </Left>

        {hasModifierOptions
          ? <Right>
              <TouchableOpacity style={{marginTop: -15}} onPress={() => this.removeAddedModifierOptions(item.modifier)}>
                <Text style={[TypographyStyles.listItemTitleTextAction]}>
                  Clear
                </Text>
              </TouchableOpacity>
            </Right>
          : null}

        {expanded
          ? <Icon name="arrow-up" style={{color: Colors.BrandRed}} />
          : <Icon name="arrow-down" style={{color: Colors.BrandRed}} />}
      </View>
    );
  }

  _renderContent = (item) => {
    const modifier = item.modifier;
    const options = modifier.options;

    return (
      <View>
        {options.map(option => {
          return (
            <ListItem key={option.title} icon onPress={() => console.log('temp disable')/*this.onModifierOptionPress(option, modifier)*/}>
              <Body>
                <Text style={TypographyStyles.listSubItemTitle}>{option.title}</Text>
              </Body>
              <Right>
                {/* <Icon name="md-add" style={{fontSize: 28, color: Colors.BrandGreen}} /> */}
              </Right>
            </ListItem>
          )
        })}
      </View>
    );
  }

  getAddedModifiersOptions = (modifier) => {
    const { addedModifiers } = this.state;
    const addedModifiersIds = Object.keys(addedModifiers);

    return addedModifiersIds.map(id => {
      const options = modifier._id === id ? addedModifiers[id] : null;
      return options ? this.getAddedModifierOptions(options, id) : null;
    });
  }

  getAddedModifierOptions = (options, id) => {
    return options.map((option, index) => (
      <Text
        key={`${index}${id}`} 
        style={TypographyStyles.noteListItem}
      >
        + {option.title}
      </Text>
    ));
  }

  removeAddedModifierOptions = (modifier) => {
    let { addedModifiers } = this.state;
    delete addedModifiers[modifier._id];
    this.setState({ addedModifiers });
  }

  onModifierOptionPress = (option, modifier) => {
    let { addedModifiers } = this.state;
    addedModifiers[modifier._id] = addedModifiers[modifier._id] ? addedModifiers[modifier._id] : [];

    // Doing this to remove __typename from options
    const opt = Object.assign({}, {title: option.title, price: option.price});
    addedModifiers[modifier._id].push(opt);

    this.setState({ addedModifiers: addedModifiers });
  }

  getOrderItemMappedData = (productId) => {
    const { addedModifiers } = this.state;
    let productModifiersOptions = [];

    Object.keys(addedModifiers).forEach(id => {
      const modifier = addedModifiers[id];
      productModifiersOptions.push(...modifier)
    });

    return productModifiersOptions;
  }

  getModifiersDataArray = (modifiers) => {
    return modifiers.map(modifier => {
      return {title: modifier.title, modifier: modifier}
    });
  }

}

const CREATE_ORDER_ITEM = gql`
  mutation createOrderItem($productId: String!, $productModifiersOptions: [ModifierOptionInput], $storeId: String!) {
    createOrderItem(productId: $productId, productModifiersOptions: $productModifiersOptions, storeId: $storeId) {
      _id,
      product {
        _id,
      }
      productModifiersOptions {
        title,
        price
      }
    }
  }
`;

const UPDATE_PRODUCT_AVAILABILITY = gql`
  mutation updateProductAvailability($productId: String!, $storeId: String!) {
    updateProductAvailability(productId: $productId, storeId: $storeId) {
      _id
      unavailableProducts {
        _id
      }
    }
  }
`;

// const WrappedComponent = graphql(CREATE_ORDER_ITEM, {
//   props: ({ mutate }) => ({
//     createOrderItem: (data) => mutate({ variables: { productId: data._id, productModifiersOptions: data.productModifiersOptions } }),
//   }),
// })(Product);

export default Product;
