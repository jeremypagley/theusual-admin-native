import React from 'react';
import { 
  Container,
  Text,
  Content
} from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import CardList from 'app/components/CardList';
import ContainerStyles from 'app/styles/generic/ContainerStyles';

class Products extends React.Component {

  render() {
    const productCategory = this.props.navigation.getParam('productCategory', null);
    const productCategoryId = productCategory._id

    return (
      <Container style={ContainerStyles.container}>
        <Content padder>
          <Query query={ProductsQuery} variables={{ productCategoryId }}>
            {({ loading, error, data }) => {
              if (loading) return <Text key="loading">Loading...</Text>;
              if (error) return <Text key="error">Error :(</Text>;

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
    return products.map((product) => {
      return {
        _id: product._id,
        title: product.title,
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
