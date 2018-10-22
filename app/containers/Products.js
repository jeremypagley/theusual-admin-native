import React from 'react';
import { 
  Container,
  Text,
  Content,
  Header
} from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import CardList from 'app/components/CardList';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';

class Products extends React.Component {

  render() {
    const productCategory = this.props.navigation.getParam('productCategory', null);
    const productCategoryId = productCategory._id;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}></Header>
        
        <Content padder style={ContainerStyles.content}>
          <Query query={ProductsQuery} variables={{ productCategoryId }}>
            {({ loading, error, data }) => {
              if (loading) return <LoadingIndicator title="Loading products" />;
              if (error) return <GenericError message={error.message} />;

              return (
                <CardList
                  data={this.getListData(data.products)}
                  handleItemPress={(item) => this.onItemPress(item, data.products)}
                />
              )
            }}
          </Query>
        </Content>
      </Container>
    );
  }

  getListData = (products) => {
    const unavailableProducts = this.props.navigation.getParam('unavailableProducts', null);

    return products.map((product) => {
      const disabled = unavailableProducts.find(p => p._id === product._id)

      return {
        _id: product._id,
        title: product.title,
        disabled: disabled,
        disabledReasonText: 'This item is unavailable'
      }
    })
  }

  onItemPress = (item, products) => {
    const { navigation } = this.props;
    const product = products.find(p => p._id === item._id);
    navigation.navigate('Product', { product });
  }

}

const ProductsQuery = gql`
  query products($productCategoryId: String!) {
    products(productCategoryId: $productCategoryId) {
      _id,
      title,
      description,
      price,
      store {
        _id,
        title
      },
      productModifiers {
        _id,
        title,
        options {
          title,
          price
        }
      }
    }
  }
`;

export default Products;
