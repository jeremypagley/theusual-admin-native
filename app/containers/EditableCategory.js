import React from 'react';
import { 
  Container,
  Text,
  Left,
  Right,
  View,
  Card,
  CardItem,
  Content,
  Toast,
  Form,
  Item,
  Spinner,
  Input,
  Label
} from 'native-base';
import { Dimensions, } from 'react-native';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import GET_ORGANIZATION_STORES from 'app/graphql/query/getOrganizationStores';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import MultiSelect from 'app/components/MultiSelect';
import ConfirmButton from 'app/components/ConfirmButton';

const screenHeight = Dimensions.get('window').height;

class EditableCategory extends React.Component {

  constructor(props) {
    super(props);

    const selectedCategory = props.navigation.getParam('productCategory', null);

    this.state = {
      title: selectedCategory.title,
      products: selectedCategory.products.map(prod => prod._id)
    }
  }

  render() {
    const selectedCategory = this.props.navigation.getParam('productCategory', null);
    const allProducts = this.props.navigation.getParam('products', []);

    const { products } = this.state;


    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.tabContent}>
          <Mutation
            mutation={EDIT_PRODUCT_CATEGORY}
            refetchQueries={(data) => {
              return [{query: GET_ORGANIZATION_STORES}];
            }}
            variables={{categoryId: selectedCategory._id, title: this.state.title, products: products}}
            onCompleted={(data) => {
              Toast.show({
                text: 'Category changes saved 👍',
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
            {(editProductCategory, { loading, error, data }) => {
              const errorNode = error ? <GenericError message={error.message} /> : null;
              const loadingNode = loading ? <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View> : null;

              return (
                <View>
                  <View style={{alignSelf: 'flex-end'}}>
                    {this.getDeleteBtn()}
                  </View>
                  <View style={[CardStyles.card]}>
                    <Card transparent>
                      {errorNode}
                      
                      <Form>
                        <Item last stackedLabel>
                          <Label>Title</Label>
                          <Input
                            onChangeText={value => this.setState({title: value})}
                            placeholder="enter title"
                            defaultValue={this.state.title}
                          />
                        </Item>
                      </Form>

                      <MultiSelect
                        items={this.getProductMultiItems(allProducts)}
                        selectText='Assign products'
                        searchPlaceholderText="Search product by name"
                        onSelectedItemsChange={(val) => this.handleInputChange('products', val)}
                        selectedItems={products ? products : []}
                      />

                      <CardItem 
                        footer 
                        button 
                        onPress={() => {
                          editProductCategory();
                          this.goBack();
                        }} 
                        style={[CardStyles.itemFooter, {marginTop: 24}]}
                      >
                        <Left />
                        <Right>
                          <View>
                            <Text style={[CardStyles.itemButtonTitle]}>
                              Save Changes
                            </Text>
                            {loadingNode}
                          </View>
                        </Right>
                      </CardItem>
                    </Card>
                  </View>
                </View>
              )
            }}
          </Mutation>
        </Content>
      </Container>
    );
  }


  getDeleteBtn = () => {
    const selectedCategory = this.props.navigation.getParam('productCategory', null);

    return (
      <Mutation
        mutation={DELETE_PRODUCT_CATEGORY}
        refetchQueries={(data) => {
          return [{query: GET_ORGANIZATION_STORES}];
        }}
        variables={{categoryId: selectedCategory._id}}
        onCompleted={(data) => {
          Toast.show({
            text: 'Modifier archived 👍',
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
        {(deleteProductCategory, { loading, error, data }) => {
          return (
            <ConfirmButton
              title="Delete Category"
              confirmText="Delete Category"
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              onPress={() => {
                deleteProductCategory();
                this.goBack();
              }}
            />
          )
        }}
      </Mutation>
    );
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  getProductMultiItems = (allProducts) => {
    let section = {name: 'Products', id: 0, icon: '', children: []};
  
    allProducts.forEach(product => {
      section.children.push({
        id: product._id,
        name: `${product.title}`,
        color: Colors.BrandBlack
      });
    });
  
    return [section];
  }
  
  handleInputChange = (field, val) => {
    let nextState = Object.assign({}, this.state);
  
    nextState[field] = val;
    this.setState(nextState);
  }

}

const EDIT_PRODUCT_CATEGORY = gql`
  mutation editProductCategory($categoryId: String!, $title: String!, $products: [String], $storeId: String) {
    editProductCategory(categoryId: $categoryId, title: $title, products: $products, storeId: $storeId) {
      _id,
    }
  }
`

const DELETE_PRODUCT_CATEGORY = gql`
  mutation deleteProductCategory($categoryId: String!) {
    deleteProductCategory(categoryId: $categoryId) {
      _id,
    }
  }
`

export default EditableCategory;
