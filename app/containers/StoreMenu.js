import React from 'react';
import { 
  Container,
  Text,
  Body,
  View,
  Tabs,
  Tab,
  Card,
  CardItem,
  Content,
  Button,
  Toast,
  Icon,
  Spinner
} from 'native-base';
import { Alert, FlatList, Platform, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import CardList from 'app/components/CardList';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import GET_ORGANIZATION_STORES from 'app/graphql/query/getOrganizationStores';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import { Audio, Constants, Notifications, Permissions } from 'expo';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';

const screenHeight = Dimensions.get('window').height;

class StoreMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    const selectedStoreId = this.props.navigation.getParam('storeId', null);

    return (
      <Container style={ContainerStyles.container}>
        <Query query={GET_ORGANIZATION_STORES} pollInterval={60000} variables={{storeId: selectedStoreId}} fetchPolicy="cache-and-network">
          {({ loading, error, data, refetch }) => {
            if (error) return <GenericError message={error.message} />;
            
            // let menuNode = <LoadingIndicator title={`Refreshing Active Orders`} />;
            if (data && data.organizationStores && !error) {
              const organization = data.organizationStores;
              const store = organization.stores.find(store => store._id === selectedStoreId);

              return (
                <View>
                  <CardList
                    data={this.getListData(store.productCategories)}
                    handleItemPress={(item) => this.onItemPress(item, store)}
                  />
                  <Mutation
                    mutation={CREATE_PRODUCT_CATEGORY}
                    refetchQueries={(data) => {
                      return [{query: GET_ORGANIZATION_STORES, variables: { storeId: selectedStoreId }}];
                    }}
                    variables={{title: 'New Category', products: [], storeId: selectedStoreId}}
                  >
                    {(createProductCategory, { loading, error, data }) => {
                      const loadingNode = loading ? <Spinner color='red' /> : null;



                      // TODO: Make these Add existing btns

                      return (
                        <TouchableOpacity onPress={() => createProductCategory()}>
                          <View style={CardStyles.card}>
                              <Card transparent>
                                <CardItem>
                                  <Body style={{flexDirection: 'row'}}>
                                    <Icon active name="add" style={{color: Colors.BrandRed}} fontSize={34} />
                                    <Text style={TypographyStyles.iconButtonCardText}>Create Category</Text>
                                    {loadingNode}
                                  </Body>
                                </CardItem>
                              </Card>
                            </View>
                        </TouchableOpacity>
                      )
                    }}
                  </Mutation>
                  <Mutation
                    mutation={CREATE_PRODUCT}
                    refetchQueries={(data) => {
                      return [{query: GET_ORGANIZATION_STORES, variables: { storeId: selectedStoreId }}];
                    }}
                    variables={{title: 'New product', storeId: selectedStoreId}}
                    onCompleted={(data) => {
                      Toast.show({
                        text: 'Created new product 👍',
                        buttonText: 'Great',
                        duration: 3000,
                        type: 'success',
                        style: {
                          backgroundColor: Colors.BrandBlack,
                          color: Colors.White
                         }
                      })
                    }}
                  >
                    {(createProduct, { loading, error, data }) => {
                      const loadingNode = loading ? <Spinner color='red' /> : null;

                      return (
                        <TouchableOpacity onPress={() => createProduct()}>
                          <View style={CardStyles.card}>
                              <Card transparent>
                                <CardItem>
                                  <Body style={{flexDirection: 'row'}}>
                                    <Icon active name="add" style={{color: Colors.BrandRed}} fontSize={34} />
                                    <Text style={TypographyStyles.iconButtonCardText}>Create Product</Text>
                                    {loadingNode}
                                  </Body>
                                </CardItem>
                              </Card>
                            </View>
                        </TouchableOpacity>
                      )
                    }}
                  </Mutation>
                </View>
              )
            }

            return (
              null
            )
          }}
        </Query>
      </Container>
    );
  }

  getListData = (productCategories) => {
    return productCategories.map((productCategory) => {
      return {
        _id: productCategory._id,
        title: productCategory.title,
      }
    })
  }

  onItemPress = (item, store) => {
    const { navigation } = this.props;
    const productCategory = store.productCategories.find(p => p._id === item._id);
    navigation.navigate('Products', { productCategory, storeId: store._id });
  }

}

const CREATE_PRODUCT_CATEGORY = gql`
  mutation createProductCategory($title: String!, $products: [String], $storeId: String!) {
    createProductCategory(title: $title, products: $products, storeId: $storeId) {
      _id,
    }
  }
`

const CREATE_PRODUCT = gql`
  mutation createProduct($title: String!, $storeId: String!) {
    createProduct(title: $title, productCategory: $products, storeId: $storeId) {
      _id,
    }
  }
`

export default StoreMenu;
