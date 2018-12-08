import React from 'react';
import { 
  Container,
  Content,
  Header,
} from 'native-base';
import { Query } from 'react-apollo';
import CardList from 'app/components/CardList';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import GET_PRODUCTS from '../graphql/query/getProducts';
import GET_ORGANIZATION_STORES from 'app/graphql/query/getOrganizationStores';

class Products extends React.Component {

  render() {
    const selectedStoreId = this.props.navigation.getParam('storeId', null);

    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}></Header>
        
        <Content padder style={ContainerStyles.content}>
          <Query query={GET_ORGANIZATION_STORES} pollInterval={10000} variables={{storeId: selectedStoreId}}>
            {({ loading, error, data }) => {
              if (error) return <GenericError message={error.message} />;
              if (loading) return <LoadingIndicator title={`Refreshing Store Data`} />;

              const organization = data.organizationStores;
              const store = organization.stores[0];

              return this.getProducts(store);
            }}
          </Query>
        </Content>
      </Container>
    );
  }

  getProducts = (store) => {
    const productCategory = this.props.navigation.getParam('productCategory', null);
    const productCategoryId = productCategory._id;

    return (
      <Query query={GET_PRODUCTS} variables={{ productCategoryId }}>
        {({ loading, error, data }) => {
          if (loading) return <LoadingIndicator title="Loading products" />;
          if (error) return <GenericError message={error.message} />;

          return (
            <CardList
              data={this.getListData(data.products, store)}
              handleItemPress={(item) => this.onItemPress(item, data.products)}
            />
          )
        }}
      </Query>
    )
  }

  getListData = (products, store) => {
    const unavailableProducts = store.unavailableProducts;

    return products.map((product) => {
      const unavailable = unavailableProducts.find(p => p._id === product._id)

      return {
        _id: product._id,
        title: product.title,
        unavailable,
        subtitle: unavailable ? 'Item is marked as Unavailable' : null
      }
    })
  }

  // Leaving here for reference if needed later, see scenes/Product for usage
  backOverride = (goBack) => {
    // const productCategory = this.props.navigation.getParam('productCategory', null);
    // const productCategoryId = productCategory._id;

    // return (
    //   <Icon name="ios-arrow-back" style={{color: 'white'}} onPress={async () => { 
    //       let {data} = await client.query({
    //         query: GET_PRODUCTS,
    //         variables: { productCategoryId }
    //       });

    //       this.props.data.refetch();
    //       goBack();
    //     }} 
    //   />
    // )
  }

  onItemPress = (item, products) => {
    const { navigation } = this.props;
    const selectedStoreId = navigation.getParam('storeId', null);
    const product = products.find(p => p._id === item._id);
    navigation.navigate('Product', { product, unavailable: item.unavailable, storeId: selectedStoreId, backOverride: this.backOverride });
  }

}

// export default graphql(GET_ORGANIZATION_STORES, {
//   options: (props) => ({ variables: { storeId: props.navigation.getParam('storeId', null) } })
// })( Products );

export default Products;
