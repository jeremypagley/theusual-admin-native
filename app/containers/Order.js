import React from 'react';
import { 
  Container,
  Content,
  Header,
  Icon,
  Item,
  Input,
  Text,
} from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import CardList from 'app/components/CardList';

import ContainerStyles from 'app/styles/generic/ContainerStyles';
import InputStyles from 'app/styles/generic/InputStyles';
import Colors from 'app/styles/Colors';

class Order extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      search: '',
    }
  }

  render() {
    const { search } = this.state;

    return (
      <Container style={ContainerStyles.container}>
        <Header searchBar rounded style={ContainerStyles.header}>
          <Item style={InputStyles.searchInput}>
            <Icon name="md-search" style={{color: Colors.BrandBlack}} />
            <Input
              clearButtonMode="always"
              value={search}
              placeholder="Search"
              onChangeText={(text) => this.setState({ search: text })}
              placeholderTextColor={Colors.BrandDarkGrey}
            />
            <Icon name="md-pin" style={{color: Colors.BrandBlack}} />
          </Item>
        </Header>
        <Content padder>
          <Query query={StoresQuery}>
            {({ loading, error, data }) => {
              if (loading) return <Text key="loading">Loading...</Text>;
              if (error) return <Text key="error">Error :(</Text>;

              return (
                <CardList
                  data={this.getListData(data)}
                  handleItemPress={(item) => this.onItemPress(item, data.stores)}
                  title="Found"
                  loading={loading}
                />
              )
            }}
          </Query>
        </Content>
      </Container>
    );
  }

  getListData = (data) => {
    const { search } = this.state;

    if (search !== '') {
      data.stores = data.stores.filter(store => {
        return store.title.toLowerCase().indexOf(search.toLowerCase()) != -1 ? store : null
      });
    }

    return data.stores.map((store) => {
      // Temp fix for when navigating to another stack calls this query but server doesnt return all values?
      if (!store.location) return null;
      return {
        _id: store._id,
        title: store.title,
        subtitle: store.location.address
      }
    })
  }

  onItemPress = (item, stores) => {
    const store = stores.find(s => s._id === item._id);
    const { navigation } = this.props;
    navigation.navigate('Store', { store });
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
