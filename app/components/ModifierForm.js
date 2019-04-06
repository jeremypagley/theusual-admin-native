import React from 'react';
import { 
  Text,
  View,
  Form,
  Item,
  Input,
  Label
} from 'native-base';
import { Dimensions, TouchableOpacity } from 'react-native';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';

const screenHeight = Dimensions.get('window').height;

class ModifierForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      productModifierForm: {
        title:  props.title ? props.title : '',
        options: props.options ? props.options : []
      }
    }
  }

  render() {
    return (
      <View>
        <Form style={{marginLeft: 10}}>
          <Item>
            <Input
              onChangeText={value => this.handleModifierChange('title', value)}
              placeholder="enter title"
              defaultValue={this.props.title}
              value={this.props.title}
            />
          </Item>

          <TouchableOpacity style={{paddingTop: 10, paddingLeft: 20}} onPress={() => this.handleModifierChange('options', {title: '', price: 0})}>
            <Text style={[CardStyles.itemButtonSecondaryTitle, {color: Colors.BrandBlack}]}>
              + Add Option
            </Text>
          </TouchableOpacity>
          {this.getModifierEditableOptions()}
        </Form>
      </View>
    );
  }

  getModifierEditableOptions = () => {
    const { options } = this.props;
    return options ? options.map((option, index) => this.getModifierOptionForm(option, index)) : [];
  }

  getModifierOptionForm = (option, index) => {
    return (
      <View key={index} style={{marginTop: 10, marginLeft: 30, marginRight: 20, marginBottom: 10, borderWidth: 1, borderRadius: 8, borderColor: Colors.BrandGrey}}>
        <Item>
          <Input
            onChangeText={value => this.handleEditModifierOptionValue('title', value, index)}
            placeholder="option title"
            defaultValue={option.title}
          />
        </Item>
        <Item last>
          <Input
            onChangeText={value => this.handleEditModifierOptionValue('price', value, index)}
            placeholder="$ option price"
            keyboardType="numeric"
            defaultValue={option.price}
          />
        </Item>

        <TouchableOpacity style={{padding: 5}} onPress={() => this.handleRemoveModifierOption(index)}>
          <Text style={[CardStyles.itemButtonSecondaryTitle]}>Remove</Text>
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
    const { onModifierChange } = this.props;
    if (onModifierChange) onModifierChange(nextModifierFormState);
  }
}

export default ModifierForm;
