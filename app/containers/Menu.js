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
import { Keyboard, Dimensions } from 'react-native';
import CardList from 'app/components/CardList';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import GET_ORGANIZATION_STORES from 'app/graphql/query/getOrganizationStores';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import MultiSelect from 'app/components/MultiSelect';
import ModifierForm from 'app/components/ModifierForm';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';

const screenHeight = Dimensions.get('window').height;

class Menu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      productCategoryForm: {
        title: ''
      },
      productForm: {
        title: '',
        price: 0,
        description: '',
        productModifiers: []
      },
      productModifierForm: {
        title: '',
        options: []
      }
    }
  }

  render() {
    const selectedStoreId = this.props.navigation.getParam('storeId', null);

    return (
      <Container style={ContainerStyles.container}>
        <Query query={GET_ORGANIZATION_STORES} pollInterval={60000} fetchPolicy="cache-and-network">
          {({ loading, error, data, refetch }) => {
            if (error) return <GenericError message={error.message} />;

            let storesNode = <LoadingIndicator title={`Loading Organization Stores`} />;
            let categoriesNode = <LoadingIndicator title={`Loading Organization Categories`} />;
            let productsNode = <LoadingIndicator title={`Loading Organization Products`} />;
            let modifiersNode = <LoadingIndicator title={`Loading Organization Modifier Sets`} />;
            
            if (data && data.organizationStores && !error) {
              let organization = data.organizationStores;
              let stores = organization.stores
              let productCategories = organization.productCategories
              let products = organization.products
              let productModifiers = organization.productModifiers

              if (productCategories) productCategories = productCategories.filter(p => !p.deleted);
              if (products) products = products.filter(p => !p.deleted);
              if (productModifiers) productModifiers = productModifiers.filter(p => !p.deleted);

              storesNode = this._getStoresNode(stores, productCategories);
              categoriesNode = this._getCategoriesNode(productCategories, products);
              modifiersNode = this._getProductModifiersNode(productModifiers);
              productsNode = this._getProductsNode(products, productCategories, productModifiers);
            }

            return (
              <Tabs tabBarUnderlineStyle={ContainerStyles.tabBarUnderline}>
                <Tab
                  tabStyle={ContainerStyles.tab}
                  activeTabStyle={ContainerStyles.activeTab}
                  textStyle={ContainerStyles.tabText}
                  activeTextStyle={ContainerStyles.activeTabText}
                  heading="Stores"
                >
                  {storesNode}
                </Tab>
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
                  heading="Modifiers"
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

  _getStoresNode = (stores, productCategories) => {
    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.tabContent}>
          <CardList
            data={this.getListData(stores)}
            handleItemPress={(item) => this.onStoreItemPress(item, productCategories, stores)}
            rightActionItem={<Icon type="FontAwesome" name="edit" style={{fontSize: 24, color: Colors.BrandBlack}} />}
            subtitle="Modify"
          />
        </Content>
      </Container>
    )
  }

  _getCategoriesNode = (productCategories, products) => {
    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.tabContent}>
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
                const { title } = this.state.productCategoryForm;
                const errorNode = error ? <GenericError message={error.message} /> : null;

                return (
                  <Card transparent>
                    {errorNode}
                    <CardItem header style={[CardStyles.itemHeader]}>
                      <Left>
                        <Text style={TypographyStyles.listSubtitle}>Create new</Text>
                      </Left>
                    </CardItem>
                    <Form>
                      <Item style={{marginLeft: 20}}>
                        <Input
                          onChangeText={value => this.setState({productCategoryForm: {title: value}})}
                          placeholder="enter title"
                          defaultValue={title}
                        />
                      </Item>
                    </Form>

                    <CardItem 
                      footer 
                      button 
                      onPress={() => {
                        createProductCategory();
                        Keyboard.dismiss();
                      }}
                      style={CardStyles.itemFooter}
                    >
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
            handleItemPress={(item) => this.onCategoryItemPress(item, products, productCategories)}
            rightActionItem={<Icon type="FontAwesome" name="edit" style={{fontSize: 24, color: Colors.BrandBlack}} />}
            subtitle="Modify"
          />
        </Content>
      </Container>
    )
  }

  _getProductsNode = (products, productCategories, productModifiers) => {
    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.tabContent}>
          <View style={[CardStyles.card]}>
            <Mutation
              mutation={CREATE_PRODUCT}
              refetchQueries={(data) => {
                return [{query: GET_ORGANIZATION_STORES}];
              }}
              variables={{title: this.state.productForm.title, price: this.state.productForm.price, description: this.state.productForm.description,  modifiers: this.state.productForm.productModifiers}}
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

                this.setState({productForm: {title: '', price: '', description: '', productModifiers: []}});
              }}
            >
              {(createProduct, { loading, error, data }) => {
                const loadingNode = loading ? <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View> : null;
                const errorNode = error ? <GenericError message={error.message} /> : null;
                const selectedModifiers = this.state.productForm.productModifiers;
                const { title, description, price } = this.state.productForm;

                return (
                  <Card transparent>
                    {errorNode}
                    <CardItem header style={[CardStyles.itemHeader]}>
                      <Left>
                        <Text style={TypographyStyles.listSubtitle}>Create new</Text>
                      </Left>
                    </CardItem>
                    <Form>
                      <Item style={{marginLeft: 20}}>
                        <Input
                          onChangeText={value => this.handleProductChange('title', value)}
                          placeholder="enter title"
                          defaultValue={title}
                        />
                      </Item>
                      <Item style={{marginLeft: 20}}>
                        <Input
                          onChangeText={value => this.handleProductChange('price', parseFloat(value))}
                          placeholder="$ enter price"
                          keyboardType="numeric"
                          defaultValue={price}
                        />
                      </Item>
                      <Item style={{marginLeft: 20}}>
                        <Input
                          onChangeText={value => this.handleProductChange('description', value)}
                          placeholder="enter description"
                          defaultValue={description}
                        />
                      </Item>
                    </Form>

                    <MultiSelect
                      items={this.getModifierMultiItems(productModifiers)}
                      selectText='Assign modifier sets'
                      searchPlaceholderText="Search modifier set by name"
                      onSelectedItemsChange={(val) => this.handleProductChange('productModifiers', val)}
                      selectedItems={selectedModifiers ? selectedModifiers : []}
                    />

                    <CardItem 
                      footer 
                      button 
                      onPress={() => {
                        createProduct();
                        Keyboard.dismiss();
                      }}
                      style={[CardStyles.itemFooter, {marginTop: 24}]}
                    >
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
            subtitle="Modify"
            handleItemPress={(item) => this.onProductItemPress(item, products, productCategories, productModifiers)}
            rightActionItem={<Icon type="FontAwesome" name="edit" style={{fontSize: 24, color: Colors.BrandBlack}} />}
          />
        </Content>
      </Container>
    );
  }

  getModifierMultiItems = (allModifiers) => {
    let section = {name: 'Modifiers', id: 0, icon: '', children: []};
  
    allModifiers.forEach(mod => {
      section.children.push({
        id: mod._id,
        name: `${mod.title}`,
        color: Colors.BrandBlack
      });
    });
  
    return [section];
  }

  _getProductModifiersNode = (modifiers) => {
    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.tabContent}>
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

                this.setState({productModifierForm: {title: '', options: []}});
              }}
            >
              {(createProductModifier, { loading, error, data }) => {
                const loadingNode = loading ? <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View> : null;
                const errorNode = error ? <GenericError message={error.message} /> : null;

                return (
                  <Card transparent>
                    {errorNode}
                    <CardItem header style={[CardStyles.itemHeader]}>
                      <Left>
                        <Text style={TypographyStyles.listSubtitle}>Create new</Text>
                      </Left>
                    </CardItem>
                    
                    <ModifierForm 
                      onModifierChange={this.handleModifierChange}
                      title={this.state.productModifierForm.title}
                      options={this.state.productModifierForm.options}
                    />

                    <CardItem 
                      footer 
                      button 
                      onPress={() => {
                        createProductModifier();
                        Keyboard.dismiss();
                      }}
                      style={[CardStyles.itemFooter, {marginTop: 20}]}
                    >
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
            subtitle="Modify"
            handleItemPress={(item) => this.onModifierItemPress(item, modifiers)}
            rightActionItem={<Icon type="FontAwesome" name="edit" style={{fontSize: 24, color: Colors.BrandBlack}} />}
          />
        </Content>
      </Container>
    );
  }
  
  handleModifierChange = (nextModifierFormState) => {
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
      let noteModifierTitle = item.productModifiers ? this.getModifierTitles(item.productModifiers) : null;
      let noteTitle = noteModifierTitle ? `Modifiers: ${noteModifierTitle}` : null;
      let description = item.description ? item.description : null;
      let subtitle = description ? `Description: ${description}` : null;

      if (item.location) subtitle = item.location.address;

      return {
        _id: item._id,
        title: title,
        subtitle: subtitle,
        noteTitle: noteTitle
      }
    });
  }

  getModifierListData = (items) => {
    return items.map((item) => {
      let title = item.price ? `${item.title} $${item.price}` : item.title;
      let subtitle = this.getModifierListOptions(item.options);

      return {
        _id: item._id,
        title: title,
        subtitle: subtitle
      }
    });
  }

  getModifierTitles = (options) => {
    if (options.length < 1) return null;

    const descriptionItems = []
  
    options.forEach((item, index) => {
      let comma = ', '
      if (index === options.length-1) comma = ''
      descriptionItems.push(`${item.title}${comma}`);
    });

    const description = `${descriptionItems.join('')}`
    return description;
  }

  getModifierListOptions = (options) => {
    if (options.length < 1) return null;

    const descriptionItems = []
  
    options.forEach((item, index) => {
      let comma = ', '
      if (index === options.length-1) comma = ''
      descriptionItems.push(`${item.title} ($${item.price})${comma}`);
    });

    const description = `${descriptionItems.join('')}`
    return description;
  }

  onStoreItemPress = (item, productCategories, stores) => {
    const { navigation } = this.props;
    const store = stores.find(p => p._id === item._id);
    navigation.navigate('EditableStore', { store, categories: productCategories });
  }

  onCategoryItemPress = (item, products, productCategories, store) => {
    const { navigation } = this.props;
    const productCategory = productCategories.find(p => p._id === item._id);
    navigation.navigate('EditableCategory', { productCategory, products });
  }
  
  onProductItemPress = (item, products, productCategories, productModifiers, store) => {
    const { navigation } = this.props;
    const product = products.find(p => p._id === item._id);
    navigation.navigate('EditableProduct', { productCategories, productModifiers, product });
  }

  onModifierItemPress = (item, productModifiers, store) => {
    const { navigation } = this.props;
    const modifier = productModifiers.find(p => p._id === item._id);
    navigation.navigate('EditableModifier', { modifier });
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
  mutation createProduct($title: String!, $price: Float!, $description: String, $modifiers: [String], $storeId: String) {
    createProduct(title: $title, price: $price, description: $description, modifiers: $modifiers, storeId: $storeId) {
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
