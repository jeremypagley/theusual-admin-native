import React from 'react';
import { 
  Container,
  Content,
  Header,
  Icon,
  Item,
  Input,
  Text,
  View
} from 'native-base';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import CardList from 'app/components/CardList';

import ContainerStyles from 'app/styles/generic/ContainerStyles';
import InputStyles from 'app/styles/generic/InputStyles';
import Colors from 'app/styles/Colors';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import GET_ORGANIZATION from 'app/graphql/query/getOrganization';
import TypographyStyles from 'app/styles/generic/TypographyStyles';

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
              placeholder="Search for your store"
              onChangeText={(text) => this.setState({ search: text })}
              placeholderTextColor={Colors.BrandDarkGrey}
            />
            <Icon name="md-pin" style={{color: Colors.BrandGrey}} />
          </Item>
        </Header>
        <Content padder>
          <Query query={GET_ORGANIZATION} pollInterval={600000}>
            {({ loading, error, data }) => {
              if (loading) return <LoadingIndicator title="Loading stores" />;
              if (error) return <GenericError message={error.message} />;
              
              const organization = data.organization;
              if (!organization) return null
              
              const listData = this.getListData(organization);
              let title = 'Select store to view order queue';

              if (listData.length < 1) title = 'No stores found';
              
              return (
                <CardList
                  data={listData}
                  handleItemPress={(item) => this.onItemPress(item, organization.stores)}
                  title={title}
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
    navigation.navigate('Store', { storeId: store._id, storeTitle: store.title, storeAddress: store.location.address });
  }

}

export default Order;
