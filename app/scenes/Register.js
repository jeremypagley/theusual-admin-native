import React from 'react';
import { Container, Button, Content, Form, Item, Input, Text } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: false,
      password: '',
      passwordError: false,
      confirmPassword: '',
      confirmPasswordError: false,
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
    const { email, password, confirmPassword } = this.state;

    if (email.length === 0) {
      return this.setState({ emailError: true });
    }
    this.setState({ emailError: false });

    if (password.length === 0) {
      return this.setState({ passwordError: true });
    }
    this.setState({ passwordError: false });

    if (confirmPassword.length === 0) {
      return this.setState({ confirmPasswordError: true });
    }
    this.setState({ confirmPasswordError: false });

    if (password !== confirmPassword) {
      return this.setState({ passwordError: true, confirmPasswordError: true });
    }

    this.setState({ passwordError: false, confirmPasswordError: false });

    this.props
      .signup(email, password)
      .then(({ data }) => {
        return this.props.screenProps.changeLoginState(true, data.signup.jwt);
      })
      .catch(e => {
        // If the error message contains email or password we'll assume that's the error.
        if (/email/i.test(e.message)) {
          this.setState({ emailError: true });
        }
        if (/password/i.test(e.message)) {
          this.setState({ passwordError: true });
        }
      });

  };

  render() {
    const { navigation } = this.props;
    const { emailError, passwordError, confirmPasswordError } = this.state;

    return (
      <Container>
        <Content>
          <Form>
            <Item error={emailError}>
              <Input
                placeholder="Email"
                onChangeText={value => this.handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Item>
            <Item error={passwordError}>
              <Input
                placeholder="Password"
                onChangeText={value => this.handleInputChange('password', value)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </Item>
            <Item last error={confirmPasswordError}>
              <Input
                placeholder="Confirm Password"
                onChangeText={value => this.handleInputChange('confirmPassword', value)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </Item>
          </Form>
          <Button full onPress={this.handleSubmit}>
            <Text>Sign Up</Text>
          </Button>
          <Button full transparent onPress={() => navigation.navigate('Login')}>
            <Text>Sign In</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default graphql(
  gql`
    mutation SignUp($email: String!, $password: String!) {
      signup(email: $email, password: $password) {
        _id
        email
        jwt
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      signup: (email, password) => mutate({ variables: { email, password } }),
    }),
  },
)(Register);
