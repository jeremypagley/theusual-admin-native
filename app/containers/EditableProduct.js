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


const screenHeight = Dimensions.get('window').height;

class EditableProduct extends React.Component {

  constructor(props) {
    super(props);

    const selectedProduct = props.navigation.getParam('product', null);

    this.state = {
      title: selectedProduct.title,
      description: selectedProduct.description,
      price: selectedProduct.price,
      productModifiers: selectedProduct.productModifiers.map(mod => mod._id)
    }
  }

  render() {
    const selectedProduct = this.props.navigation.getParam('product', null);
    const allModifiers = this.props.navigation.getParam('productModifiers', []);

    const { productModifiers } = this.state;

    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.tabContent}>
          <View style={[CardStyles.card]}>
            <Mutation
              mutation={EDIT_PRODUCT}
              refetchQueries={(data) => {
                return [{query: GET_ORGANIZATION_STORES}];
              }}
              variables={{productId: selectedProduct._id, title: this.state.title, price: this.state.price, description: this.state.description, modifiers: productModifiers}}
              onCompleted={(data) => {
                Toast.show({
                  text: 'Product changes saved 👍',
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
              {(editProduct, { loading, error, data }) => {
                if (error) return <GenericError message={error.message} />;
                const loadingNode = loading ? <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View> : null;

                return (
                  <Card transparent>
                    <Form>
                      <Item last stackedLabel>
                        <Label>Set Title</Label>
                        <Input
                          onChangeText={value => this.setState({title: value})}
                          placeholder="enter title"
                          defaultValue={this.state.title}
                        />
                      </Item>
                    </Form>

                    <MultiSelect
                      items={this.getModifierMultiItems(allModifiers)}
                      selectText='Assign modifier sets'
                      searchPlaceholderText="Search modifier set by name"
                      onSelectedItemsChange={(val) => this.handleInputChange('productModifiers', val)}
                      selectedItems={productModifiers ? productModifiers : []}
                    />

                    <CardItem footer button onPress={() => editProduct()} style={[CardStyles.itemFooter, {marginTop: 24}]}>
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
                )
              }}
            </Mutation>
          </View>
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
  
  handleInputChange = (field, val) => {
    let nextState = Object.assign({}, this.state);
  
    nextState[field] = val;
    this.setState(nextState);
  }

}

const EDIT_PRODUCT = gql`
  mutation editProduct($productId: String!, $title: String!, $price: Float!, $description: String, $modifiers: [String], $storeId: String) {
    editProduct(productId: $productId, title: $title, price: $price, description: $description, modifiers: $modifiers, storeId: $storeId) {
      _id,
    }
  }
`

export default EditableProduct;
