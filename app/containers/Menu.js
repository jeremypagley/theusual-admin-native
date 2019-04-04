import React from 'react';
import { 
  Container,
  Text,
  Body,
  Left,
  Right,
  View,
  Tabs,
  Tab,
  Card,
  CardItem,
  Content,
  Button,
  Toast,
  Icon,
  Form,
  Item,
  Spinner,
  Input,
  Row
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

class Menu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      productCategoryForm: {
        title: 'New category'
      },
      productForm: {
        title: 'New product',
        price: 0,
        description: ''
      },
      productModifierForm: {
        title: '',
        options: []
      }
    }
  }

  render() {
    const selectedStoreId = this.props.navigation.getParam('storeId', null);

    console.log('productModifierForm=============: ',this.state.productModifierForm)

    return (
      <Container style={ContainerStyles.container}>
        <Query query={GET_ORGANIZATION_STORES} pollInterval={60000} fetchPolicy="cache-and-network">
          {({ loading, error, data, refetch }) => {
            if (error) return <GenericError message={error.message} />;

            let categoriesNode = <LoadingIndicator title={`Loading Organization Categories`} />;
            let productsNode = <LoadingIndicator title={`Loading Organization Products`} />;
            let modifiersNode = <LoadingIndicator title={`Loading Organization Modifier Sets`} />;
            
            if (data && data.organizationStores && !error) {
              const organization = data.organizationStores;
              const productCategories = organization.productCategories
              const products = organization.products
              const productModifiers = organization.productModifiers

              categoriesNode = this._getCategoriesNode(productCategories);
              productsNode = this._getProductsNode(products);
              modifiersNode = this._getProductModifiersNode(productModifiers);
            }

            return (
              <Tabs tabBarUnderlineStyle={ContainerStyles.tabBarUnderline}>
                <Tab
                  tabStyle={ContainerStyles.tab}
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Categories"
                >
                  {categoriesNode}
                </Tab>

                <Tab 
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Products"
                >
                  {productsNode}
                </Tab>

                <Tab 
                  tabStyle={ContainerStyles.tab} 
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Modifier Sets"
                >
                  {modifiersNode}
                </Tab>
              </Tabs>
            )
          }}
        </Query>
      </Container>
    );
  }

  _getCategoriesNode = (productCategories) => {
    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.content}>
          <View style={[CardStyles.card]}>
            <Mutation
              mutation={CREATE_PRODUCT_CATEGORY}
              refetchQueries={(data) => {
                return [{query: GET_ORGANIZATION_STORES}];
              }}
              variables={{title: this.state.productCategoryForm.title}}
              onCompleted={(data) => {
                Toast.show({
                  text: 'Created new category 👍',
                  buttonText: 'Great',
                  duration: 3000,
                  type: 'success',
                  style: {
                    backgroundColor: Colors.BrandBlack,
                    color: Colors.White
                  }
                })

                this.setState({productCategoryForm: {title: ''}});
              }}
            >
              {(createProductCategory, { loading, error, data }) => {
                const loadingNode = loading ? <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View> : null;

                return (
                  <Card transparent>
                    <Form>
                      <Item last>
                        <Input
                          onChangeText={value => this.setState({productCategoryForm: {title: value}})}
                          placeholder="enter title"
                        />
                      </Item>
                    </Form>

                    <CardItem footer button onPress={() => createProductCategory()} style={CardStyles.itemFooter}>
                      <Left />
                      <Right>
                        <View style={{marginTop: 10}}>
                          <Text style={[CardStyles.itemButtonTitle]}>
                            Create Category
                          </Text>
                          {loadingNode}
                        </View>
                      </Right>
                    </CardItem>
                  </Card>
                )
              }}
            </Mutation>
          </View>

          <CardList
            data={this.getListData(productCategories)}
            // handleItemPress={(item) => this.onItemPress(item, store)}
          />
        </Content>
      </Container>
    )
  }

  _getProductsNode = (products) => {
    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.content}>
          <View style={[CardStyles.card]}>
            <Mutation
              mutation={CREATE_PRODUCT}
              refetchQueries={(data) => {
                return [{query: GET_ORGANIZATION_STORES}];
              }}
              variables={{title: this.state.productForm.title, price: this.state.productForm.price, description: this.state.productForm.description}}
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

                this.setState({productForm: {title: '', price: 0, description: ''}});
              }}
            >
              {(createProduct, { loading, error, data }) => {
                const loadingNode = loading ? <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View> : null;

                return (
                  <Card transparent>
                    <Form>
                      <Item>
                        <Input
                          onChangeText={value => this.handleProductChange('title', value)}
                          placeholder="enter title"
                        />
                      </Item>
                      <Item>
                        <Input
                          onChangeText={value => this.handleProductChange('price', parseFloat(value))}
                          placeholder="enter price (numeric only)"
                          keyboardType="numeric"
                        />
                      </Item>
                      <Item last>
                        <Input
                          onChangeText={value => this.handleProductChange('description', value)}
                          placeholder="enter description"
                        />
                      </Item>
                    </Form>

                    <CardItem footer button onPress={() => createProduct()} style={CardStyles.itemFooter}>
                      <Left />
                      <Right>
                        <View style={{marginTop: 10}}>
                          <Text style={[CardStyles.itemButtonTitle]}>
                            Create Product
                          </Text>
                          {loadingNode}
                        </View>
                      </Right>
                    </CardItem>
                  </Card>
                )
              }}
            </Mutation>
          </View>

          <CardList
            data={this.getListData(products)}
            // handleItemPress={(item) => this.onItemPress(item, store)}
          />
        </Content>
      </Container>
    );
  }

  _getProductModifiersNode = (modifiers) => {
    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.content}>
          <View style={[CardStyles.card]}>
            <Mutation
              mutation={CREATE_PRODUCT_MODIFIER}
              refetchQueries={(data) => {
                return [{query: GET_ORGANIZATION_STORES}];
              }}
              variables={{title: this.state.productModifierForm.title, options: this.state.productModifierForm.options}}
              onCompleted={(data) => {
                Toast.show({
                  text: 'Created new modifier 👍',
                  buttonText: 'Great',
                  duration: 3000,
                  type: 'success',
                  style: {
                    backgroundColor: Colors.BrandBlack,
                    color: Colors.White
                  }
                })

                // this.setState({productModifierForm: {title: ''}});
              }}
            >
              {(createProductModifier, { loading, error, data }) => {
                const loadingNode = loading ? <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View> : null;

                return (
                  <Card transparent>
                    <Form>
                      <Item>
                        <Input
                          onChangeText={value => this.handleModifierChange('title', value)}
                          placeholder="enter set title"
                        />
                      </Item>
                      <TouchableOpacity style={{paddingTop: 15, paddingLeft: 15}} onPress={() => this.handleModifierChange('options', {title: '', price: 0})}>
                        <Text style={[CardStyles.itemButtonTitle, {color: Colors.BrandBlack}]}>
                          + Add Option
                        </Text>
                      </TouchableOpacity>

                      {this.getModifierEditableOptions()}
                    </Form>

                    <CardItem footer button onPress={() => createProductModifier()} style={[CardStyles.itemFooter, {marginTop: 20}]}>
                      <Left />
                      <Right>
                        <View style={{marginTop: 10}}>
                          <Text style={[CardStyles.itemButtonTitle]}>
                            Create Set
                          </Text>
                          {loadingNode}
                        </View>
                      </Right>
                    </CardItem>
                  </Card>
                )
              }}
            </Mutation>
          </View>

          <CardList
            data={this.getModifierListData(modifiers)}
            // handleItemPress={(item) => this.onItemPress(item, store)}
          />
        </Content>
      </Container>
    );
  }

  getModifierEditableOptions = () => {
    const { options } = this.state.productModifierForm;
    return options ? options.map((option, index) => this.getModifierOptionForm(option, index)) : [];

  }

  getModifierOptionForm = (option, index) => {
    return (
      <View key={index} style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10, borderWidth: 1, borderRadius: 8, borderColor: Colors.BrandGrey}}>
        <Item>
          <Input
            onChangeText={value => this.handleEditModifierOptionValue('title', value, index)}
            placeholder="enter title"
            value={option.title}
            defaultValue={option.title}
          />
        </Item>
        <Item last>
          <Input
            onChangeText={value => this.handleEditModifierOptionValue('price', parseFloat(value), index)}
            placeholder="enter price (numbers only)"
            keyboardType="numeric"
            value={option.price}
            defaultValue={option.price}
          />
        </Item>

        <TouchableOpacity style={{padding: 5}} onPress={() => this.handleRemoveModifierOption(index)}>
          <Text style={[CardStyles.itemButtonTitle, {color: Colors.BrandBlack}]}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  }

  handleRemoveModifierOption = (index) => {
    let nextModifierFormState = {
      ...this.state.productModifierForm,
    };

    nextModifierFormState.options.splice(index, 1);
    this.setState({productModifierForm: nextModifierFormState});
  }

  handleEditModifierOptionValue = (field, value, index) => {
    let nextModifierFormState = {
      ...this.state.productModifierForm,
    };

    nextModifierFormState.options[index][field] = value;

    this.setState({productModifierForm: nextModifierFormState});
  }
  
  handleModifierChange = (field, value) => {
    let nextModifierFormState = {};

    if (field === 'options') {
      nextModifierFormState = {
        ...this.state.productModifierForm,
      }

      nextModifierFormState[field].push(value);

    } else {
      nextModifierFormState = {
        ...this.state.productModifierForm,
        [field]: value,
      }
    }
    this.setState({productModifierForm: nextModifierFormState});
  }

  handleProductChange = (field, value) => {
    let nextProductFormState = {
      ...this.state.productForm,
      [field]: value,
    };
    this.setState({productForm: nextProductFormState});
  }

  getListData = (items) => {
    return items.map((item) => {
      let title = item.price ? `${item.title} $${item.price}` : item.title
      return {
        _id: item._id,
        title: title,
        subtitle: item.description ? item.description : null
      }
    });
  }

  getModifierListData = (items) => {
    return items.map((item) => {
      let title = item.price ? `${item.title} $${item.price}` : item.title
      return {
        _id: item._id,
        title: title,
        subtitle: item.description ? item.description : null
      }
    });
  }

  onItemPress = (item, store) => {
    const { navigation } = this.props;
    const productCategory = store.productCategories.find(p => p._id === item._id);
    navigation.navigate('Products', { productCategory, storeId: store._id });
  }

}

const CREATE_PRODUCT_CATEGORY = gql`
  mutation createProductCategory($title: String!, $products: [String], $storeId: String) {
    createProductCategory(title: $title, products: $products, storeId: $storeId) {
      _id,
    }
  }
`

const CREATE_PRODUCT = gql`
  mutation createProduct($title: String!, $price: Float!, $description: String, $storeId: String) {
    createProduct(title: $title, price: $price, description: $description, storeId: $storeId) {
      _id,
    }
  }
`

const CREATE_PRODUCT_MODIFIER = gql`
  mutation createProductModifier($title: String!, $options: [ModifierOptionInput], $storeId: String) {
    createProductModifier(title: $title, options: $options, storeId: $storeId) {
      _id,
    }
  }
`

export default Menu;
