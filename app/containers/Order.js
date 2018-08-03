import React from 'react';
import { 
  Container,
  Text,
  List,
  ListItem,
  Content,
  Title,
  Header,
  Right,
  Body,
  Form,
  Input,
  Item,
  Label,
  H1
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ContainerStyles from 'app/styles/generic/ContainerStyles.js'

class Order extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      search: '',
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    }
  }
  
  onRegionChange(region) {
    this.setState({ region });
  }
  
  handleLogout = () => {
    return this.props.screenProps.changeLoginState(false);
  };

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <H1>Header</H1>
          </Body>
          <Right />
        </Header>

        <Grid>
          <Row size={1}>
            <Col>
              <Form>
                <Item floatingLabel>
                  <Label>Search location by title</Label>
                  <Input
                    clearButtonMode="always"
                    value={this.state.search}
                    onChangeText={(text) => this.setState({ search: text })}
                  />
                </Item>
              </Form>
            </Col>
          </Row>
          <Row size={6}>
            <Content>
              <Query query={StoresQuery}>
                {({ loading, error, data }) => {
                    console.log('error: ', error)

                  if (loading) return <Text key="loading">Loading...</Text>;
                  if (error) return <Text key="error">Error :(</Text>;

                  return (
                    <List>
                      <ListItem itemHeader first>
                        <Text>FOUND</Text>
                      </ListItem>     
                      {this.getListItems(data)}
                    </List>
                  )
                }}
              </Query>
            </Content>
          </Row>
        </Grid>

       
      </Container>
    );
  }

  getListItems = (data) => {
    const { search } = this.state;

    if (search !== '') {
      data.stores = data.stores.filter(store => {
        return store.title.toLowerCase().indexOf(search.toLowerCase()) != -1 ? store : null
      });
    }

    return data.stores.map((store) => {
      return (
        <ListItem onPress={() => this.onItemPress(store)} key={store._id}>
          <Body>
            <Text>{store.title}</Text>
            <Text note>{store.location.address}</Text>
          </Body>
        </ListItem>
      )
    })
  }

  onItemPress = (data) => {
    const { navigation } = this.props;
    navigation.navigate('Store', {store: data});
  }

}

const StoresQuery = gql`
{
  stores {
    _id,
    title,
    description,
    hours,
    phone,
    website,
    location {
      address
    },
    productCategories {
      _id,
      title,
      products {
        _id,
        title,
        description
      }
    }
  }
}
`

export default Order;
