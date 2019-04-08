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
import ModifierForm from 'app/components/ModifierForm';
import ConfirmButton from 'app/components/ConfirmButton';

const screenWidth = Dimensions.get('window').width;

class EditableModifier extends React.Component {

  constructor(props) {
    super(props);

    const selectedModifier = props.navigation.getParam('modifier', null);
    this.state = {
      title: selectedModifier.title,
      options: selectedModifier.options
    }
  }

  render() {
    const selectedModifier = this.props.navigation.getParam('modifier', null);

    let { options } = this.state;
    options.forEach(o => delete o.__typename)

    return (
      <Container style={ContainerStyles.container}>
        <Content padder style={ContainerStyles.tabContent}>
          <Mutation
            mutation={EDIT_PRODUCT_MODIFIER}
            refetchQueries={(data) => {
              return [{query: GET_ORGANIZATION_STORES}];
            }}
            variables={{modifierId: selectedModifier._id, title: this.state.title, options: options}}
            onCompleted={(data) => {
              Toast.show({
                text: 'Modifier changes saved 👍',
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
            {(editProductModifier, { loading, error, data }) => {
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
                      
                      <ModifierForm 
                        onModifierChange={this.handleModifierChange}
                        options={this.state.options}
                        title={this.state.title}
                      />

                      <CardItem 
                        footer 
                        button 
                        onPress={() => {
                          this.goBack();
                          editProductModifier();
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
    const selectedModifier = this.props.navigation.getParam('modifier', null);

    return (
      <Mutation
        mutation={DELETE_PRODUCT_MODIFIER}
        refetchQueries={(data) => {
          return [{query: GET_ORGANIZATION_STORES}];
        }}
        variables={{modifierId: selectedModifier._id}}
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
        {(deleteProductModifier, { loading, error, data }) => {
          return (
            <ConfirmButton
              title="Delete Modifier"
              confirmText="Delete Modifier"
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              onPress={() => {
                deleteProductModifier();
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

  handleModifierChange = (nextModifierFormState) => {
    this.setState(nextModifierFormState);
  }

}

const EDIT_PRODUCT_MODIFIER = gql`
  mutation editProductModifier($modifierId: String!, $title: String!, $options: [ModifierOptionInput], $storeId: String) {
    editProductModifier(modifierId: $modifierId, title: $title, options: $options, storeId: $storeId) {
      _id,
    }
  }
`

const DELETE_PRODUCT_MODIFIER = gql`
  mutation deleteProductModifier($modifierId: String!) {
    deleteProductModifier(modifierId: $modifierId) {
      _id,
    }
  }
`

export default EditableModifier;
