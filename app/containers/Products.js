import React from 'react';
import { 
  Container,
  Text,
  Title,
  H1,
  Header,
  Body,
  ListItem,
  Right,
  Button
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { FlatList } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

class Products extends React.Component {
  render() {
    const productCategory = this.props.navigation.getParam('productCategory', null);
    const productCategoryId = productCategory._id

    console.log('productCategoryId: ', productCategoryId)
    
    return (
      <Container>
        <Header>
          <Body>
            <H1>{productCategory.title}</H1>
          </Body>
        </Header>

          <Grid>
            <Row size={40}>
              <Col>
                <Query query={ProductsQuery} variables={{ productCategoryId }}>
                  {({ loading, error, data }) => {
                    if (loading) return <Text key="loading">Loading...</Text>;
                    console.log('data: ', data)
                    console.log('error: ', error)
                    if (error) return <Text key="error">Error :(</Text>;

                    return (
                      <FlatList
                        renderItem={({item, index}) => this.getListItem(item)}
                        data={data.products}
                        keyExtractor={(item, index) => item._id}
                      />
                    )
                  }}
                </Query>
              </Col>
            </Row>
          </Grid>
      </Container>
    );
  }

  getListItem = (item) => {
    return (
      <ListItem key={item._id} icon>
        <Body>
          <Text>{item.title}</Text>
        </Body>
        <Right>
          <Button transparent primary>
            <Text>Add</Text>
          </Button>
          <Button transparent primary onPress={() => this.onItemPress(item)}>
            <Text>Edit</Text>
          </Button>
        </Right>
      </ListItem>
    );
  }

  onItemPress = (data) => {
    const { navigation } = this.props;
    navigation.navigate('Product', {product: data});
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
