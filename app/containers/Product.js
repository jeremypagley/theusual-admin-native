import React from 'react';
import { 
  Container,
  Text,
  Title,
  H1,
  Header,
  Body,
  ListItem,
  Button
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { FlatList } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

class Product extends React.Component {
  render() {
    const product = this.props.navigation.getParam('product', null);
    console.log('product: ', product)
    
    return (
      <Container>
        <Header>
          <Body>
            <H1>{product.title}</H1>
          </Body>
        </Header>

          <Grid>
            <Row size={10}>
              <Text note>{product.description}</Text>
            </Row>
            <Row size={80}>
              <Col>
                <FlatList
                  renderItem={({item, index}) => this.getListItem(item)}
                  data={product.productModifiers}
                  keyExtractor={(item, index) => item._id}
                />
              </Col>
            </Row>
            <Row size={10}>
              <Col>
                <Button transparent block primary>
                  <Text>Add item</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
      </Container>
    );
  }

  getListItem = (productModifier) => {
    return (
      <ListItem onPress={() => this.onItemPress(productModifier)} key={productModifier._id}>
        <Text>{productModifier.title}</Text>
      </ListItem>
    )
  }

  onItemPress = (data) => {
    const { navigation } = this.props;
    navigation.navigate('ProductModifier', {productModifier: data});
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

export default Product;
