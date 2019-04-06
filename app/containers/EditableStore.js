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
  Spinner,
} from 'native-base';
import { Dimensions, } from 'react-native';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import GET_ORGANIZATION_STORES from 'app/graphql/query/getOrganizationStores';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import GenericError from 'app/components/GenericError';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import MultiSelect from 'app/components/MultiSelect';

const screenHeight = Dimensions.get('window').height;

class EditableStore extends React.Component {

  constructor(props) {
    super(props);

    const selectedStore = props.navigation.getParam('store', null);

    this.state = {
      title: selectedStore.title,
      categories: selectedStore.productCategories.map(prod => prod._id)
    }
  }

  render() {
    const selectedStore = this.props.navigation.getParam('store', null);
    const allCategories = this.props.navigation.getParam('categories', []);

    let { categories } = this.state;

    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.tabContent}>
          <Mutation
            mutation={EDIT_STORE}
            refetchQueries={(data) => {
              return [{query: GET_ORGANIZATION_STORES}];
            }}
            variables={{storeId: selectedStore._id, categories }}
            onCompleted={(data) => {
              Toast.show({
                text: 'Store changes saved 👍',
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
            {(editStore, { loading, error, data }) => {
              if (error) return <GenericError message={error.message} />;
              const loadingNode = loading ? <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View> : null;

              return (
                <View>
                  <View style={[CardStyles.card]}>
                    <Card transparent>
                      {/* <Form>
                        <Item last stackedLabel>
                          <Label>Title</Label>
                          <Input
                            onChangeText={value => this.setState({title: value})}
                            placeholder="enter title"
                            defaultValue={this.state.title}
                          />
                        </Item>
                      </Form> */}

                      <MultiSelect
                        items={this.getMultiItems(allCategories)}
                        selectText='Assign categories to store'
                        searchPlaceholderText="Search category by name"
                        onSelectedItemsChange={(val) => this.handleInputChange('categories', val)}
                        selectedItems={categories ? categories : []}
                      />

                      <CardItem 
                        footer 
                        button 
                        onPress={() => {
                          editStore();
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


  // getDeleteBtn = () => {
  //   const selectedCategory = this.props.navigation.getParam('productCategory', null);

  //   return (
  //     <Mutation
  //       mutation={DELETE_PRODUCT_CATEGORY}
  //       refetchQueries={(data) => {
  //         return [{query: GET_ORGANIZATION_STORES}];
  //       }}
  //       variables={{categoryId: selectedCategory._id}}
  //       onCompleted={(data) => {
  //         Toast.show({
  //           text: 'Modifier archived 👍',
  //           buttonText: 'Great',
  //           duration: 3000,
  //           type: 'success',
  //           style: {
  //             backgroundColor: Colors.BrandBlack,
  //             color: Colors.White
  //           }
  //         })
  //       }}
  //     >
  //       {(deleteProductCategory, { loading, error, data }) => {
  //         return (
  //           <ConfirmButton
  //             title="Delete Category"
  //             confirmText="Delete Category"
  //             confirmButtonText="Delete"
  //             cancelButtonText="Cancel"
  //             onPress={() => {
  //               deleteProductCategory();
  //               this.goBack();
  //             }}
  //           />
  //         )
  //       }}
  //     </Mutation>
  //   );
  // }

  goBack = () => {
    this.props.navigation.goBack();
  }

  getMultiItems = (items) => {
    let section = {name: 'Categories', id: 0, icon: '', children: []};
  
    items.forEach(item => {
      section.children.push({
        id: item._id,
        name: `${item.title}`,
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

const EDIT_STORE = gql`
  mutation editStore($storeId: String! $categories: [String]) {
    editStore(storeId: $storeId, categories: $categories) {
      _id,
    }
  }
`

export default EditableStore;
