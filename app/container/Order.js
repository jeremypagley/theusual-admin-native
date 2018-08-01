import React from 'react';
import { Container, Text, Button, Content } from 'native-base';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

class Order extends React.Component {
  handleLogout = () => {
    return this.props.screenProps.changeLoginState(false);
  };

  render() {
    // const { currentUser } = this.props.data;

    return (
      <Container>
        <Content>
          <Query query={StoresQuery}>
            {({ loading, error, data }) => {
              if (loading) return <Text>Loading...</Text>;
              if (error) return <Text>Error :(</Text>;

              return data.stores.map(({ title, _id }) => (
                <View key={_id}>
                  <Text>{title}</Text>
                </View>
              ));
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
