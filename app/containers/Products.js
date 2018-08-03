import React from 'react';
import { 
  Container,
  Text,
  Title,
  Header,
  Body,
  ListItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { SectionList } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

class Product extends React.Component {
  render() {
    const productCategory = this.props.navigation.getParam('productCategory', null);
    console.log(productCategory)
    let productCategoryId = productCategory._id
    
    return (
      <Container>
        <Header>
          <Body>
            <Title>{productCategory.title}</Title>
          </Body>
        </Header>

          <Grid>
            <Row size={40}>
              <Col>
                <Query query={ProductsQuery} variables={{ productCategoryId }}>
                  {({ loading, error, data }) => {
                    if (loading) return <Text key="loading">Loading...</Text>;
                    if (error) return <Text key="error">Error :(</Text>;

                    return (
                      <SectionList
                        renderItem={({item, index, section}) => this.getListItem(item)}
                        renderSectionHeader={({section: {title}}) => (
                          <Text style={{fontWeight: 'bold'}}>{title}</Text>
                        )}
                        sections={[
                          {title: 'MENU', data: store.productCategories},
                        ]}
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
      <ListItem onPress={() => this.onItemPress(item)} key={item._id}>
        <Text>{item.title}</Text>
      </ListItem>
    )
  }

  onItemPress = (data) => {
    const { navigation } = this.props;
    navigation.navigate('Product', {products: data});
  }

}

const ProductsQuery = gql`
  query products($productCategoryId: String!) {
    products(productCategoryId: $productCategoryId) {
      _id,
      title,
      description,
      price,
      usual,
      productModifiers {
        _id,
        title
      }
    }
  }
`;

export default Product;
