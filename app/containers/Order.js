import React from 'react';
import { Container, Text, List, ListItem, Content, Title, Header, Right, Body, Left } from 'native-base';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ContainerStyles from 'app/styles/generic/ContainerStyles.js'

class Order extends React.Component {
  handleLogout = () => {
    return this.props.screenProps.changeLoginState(false);
  };

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Query query={StoresQuery}>
            {({ loading, error, data }) => {
              if (loading) return <Text key="loading">Loading...</Text>;
              if (error) return <Text key="error">Error :(</Text>;

                console.log(data)
              return (
                <List>
                  <ListItem itemHeader first>
                    <Text>FOUND</Text>
                  </ListItem>     
                  {data.stores.map(({ _id, title, location }) => {
                    return (
                      <ListItem key={_id}>
                        <Body>
                          <Text>{title}</Text>
                          <Text note>{location.latitude} - {location.longitude}</Text>
                        </Body>
                      </ListItem>
                    )
                  })}
                </List>
              )

            }}
          </Query>
        </Content>
      </Container>
    );
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
      latitude,
      longitude
    },
    productCategories {
      title,
      products
    }
  }
}
`

export default Order;
