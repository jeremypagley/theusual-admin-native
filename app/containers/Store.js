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

class Store extends React.Component {
  render() {
    const store = this.props.navigation.getParam('store', null);
    
    return (
      <Container>
        <Header>
          <Body>
            <Title>Company Logo</Title>
          </Body>
        </Header>

          <Grid>
            <Row size={10}>
              <Col>
                <Text>Hours</Text>
                <Text note>{store.hours}</Text>
              </Col>
              <Col>
                <Text>Phone</Text>
                <Text note>{store.phone}</Text>
              </Col>
              <Col>
                <Text>Website</Text>
                <Text note>{store.website}</Text>
              </Col>
            </Row>

            <Row size={10}>
              <Text note>{store.description}</Text>
            </Row>

            <Row size={40}>
              <Col>
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
              </Col>
            </Row>
            <Row size={40}>
              <Col>
                <Text>LOCATIONS TODO</Text>
                {/* <SectionList
                  renderItem={({item, index, section}) => this.getListItem(item)}
                  renderSectionHeader={({section: {title}}) => (
                    <Text style={{fontWeight: 'bold'}}>{title}</Text>
                  )}
                  sections={[
                    {title: 'MENU', data: store.productCategories},
                  ]}
                  keyExtractor={(item, index) => item._id}
                /> */}
              </Col>
            </Row>
          </Grid>
      </Container>
    );
  }

  getListItem = (productCategory) => {
    return (
      <ListItem onPress={() => this.onItemPress(productCategory)} key={productCategory._id}>
        <Text>{productCategory.title}</Text>
      </ListItem>
    )
  }

  onItemPress = (data) => {
    const { navigation } = this.props;
    navigation.navigate('Products', {productCategory: data});
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
