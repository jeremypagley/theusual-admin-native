import React from 'react';
import { 
  Container,
  Text,
  List,
  ListItem,
  Content,
  Header,
  Body,
  Form,
  Input,
  Item,
  Label,
  H1,
  H3,
  Card, 
  CardItem,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardListStyles from 'app/styles/generic/CardListStyles';
import CardInputStyles from 'app/styles/generic/CardInputStyles';

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
    const { search } = this.state;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={ContainerStyles.header}>
          <Body>
            <H1>Order from:</H1>
          </Body>
        </Header>

        <Grid>
          <Row size={1}>
            <Col>
              <Card style={CardInputStyles.card}>
                <CardItem style={CardInputStyles.cardItem}>
                  <Body>
                    <Form style={CardInputStyles.form}>
                      <Item underline={false} style={CardInputStyles.formItem} floatingLabel>
                        <Label style={CardInputStyles.formItemLabel}>Search location by title</Label>
                        <Input
                          clearButtonMode="always"
                          value={search}
                          style={CardInputStyles.formInput}
                          onChangeText={(text) => this.setState({ search: text })}
                        />
                      </Item>
                    </Form>
                    </Body>
                </CardItem>
              </Card>
            </Col>
          </Row>
          <Row size={6}>
            <Content>
              <Query query={StoresQuery}>
                {({ loading, error, data }) => {
                  if (loading) return <Text key="loading">Loading...</Text>;
                  if (error) return <Text key="error">Error :(</Text>;

                  return (
                    <List>
                      <ListItem itemHeader first style={CardListStyles.listItem}>
                        <Text>LOCATIONS</Text>
                      </ListItem>
                      <Card style={CardListStyles.card}>
                        {this.getListItems(data)}
                      </Card>
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
      // Temp fix for when navigating to another stack calls this query but server doesnt return all values?
      if (!store.location) return null;
      return (
        <CardItem button onPress={() => this.onItemPress(store)} key={store._id} style={CardListStyles.cardItem}>
          <Body>
            <H3 style={CardListStyles.cardItemTitle}>{store.title}</H3>
            <Text note>{store.location.address}</Text>
          </Body>
        </CardItem>
      )
    })
  }

  onItemPress = (data) => {
    console.log(data)
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
