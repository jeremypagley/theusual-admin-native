import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Container, Header, Label, Content, Form, Item, Input, Text, Card, View } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import Colors from 'app/styles/Colors';
import GradientButton from 'app/components/GradientButton';
import GenericError from 'app/components/GenericError';
import validator from 'validator';

class Login extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Login'
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: false,
      password: '',
      passwordError: false,
      loggingIn: false
    };
  }

  handleInputChange = (field, value) => {
    const newState = {
      ...this.state,
      [field]: value,
    };
    this.setState(newState);
  };

  handleSubmit = () => {
    const { email, password } = this.state;
    
    this.setState({loggingIn: true});

    this.props
      .login(email, password)
      .then(({ data }) => {
        this.setState({loggingIn: false});
        return this.props.screenProps.changeLoginState(true, data.login.jwt);
      })
      .catch(e => {
        this.setState({loggingIn: false});

        // If the error message contains email or password we'll assume that's the error.
        if (/email/i.test(e.message)) {
          this.setState({ emailError: e.message });
        }
        if (/password/i.test(e.message)) {
          this.setState({ passwordError: e.message });
        }
      });
  };

  render() {
    const { emailError, passwordError, email, password, loggingIn } = this.state;
    let disabled = true;

    if (email.length > 0 && password.length >= 6 && validator.isEmail(email)) disabled = false;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={[ContainerStyles.header]}></Header>

        <Content padder style={ContainerStyles.content}>
          <View style={[CardStyles.card, {paddingBottom: 20}]}>
            {emailError && <GenericError message={emailError} style={{marginLeft: 10}} />}
            {passwordError && <GenericError message={passwordError} style={{marginLeft: 10}} />}
            <Card transparent>
              <Form>
                <Item floatingLabel>
                  <Label>Email</Label>
                  <Input
                    onChangeText={value => this.handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Password (must be more than 6 characters)</Label>
                  <Input
                    onChangeText={value => this.handleInputChange('password', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                  />
                </Item>
              </Form>
            </Card>
          </View>
          
          <GradientButton
            disabled={disabled}
            title={loggingIn ? <Text style={TypographyStyles.buttonText}><ActivityIndicator size="small" color={Colors.White} /> Logging In</Text> : "Sign In"}
            fill
            buttonProps={{
              onPress: () => this.handleSubmit()
            }}
          />
        </Content>
      </Container>
    );
  }
}

export default graphql(
  gql`
    mutation LogIn($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        _id
        email
        jwt
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      login: (email, password) => mutate({ variables: { email, password } }),
    }),
  },
)(Login);
