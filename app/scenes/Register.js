import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Container, Header, Label, Content, Form, Item, Input, Text, Card, View, Button } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import ButtonStyles from 'app/styles/generic/ButtonStyles';
import Colors from 'app/styles/Colors';
import GradientButton from 'app/components/GradientButton';
import GenericError from 'app/components/GenericError';
import validator from 'validator';
import { WebBrowser, Constants } from 'expo';
import Auth from 'app/auth';
import CardList from 'app/components/CardList';

const {
  apiEndpoint,
  apiEndpointTerms
} = Auth.getKeys();

class Register extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sign Up'
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: false,
      firstName: '',
      lastName: '',
      password: '',
      passwordError: false,
      confirmPassword: '',
      confirmPasswordError: false,
      signingUp: false
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
    const { firstName, lastName, email, password, confirmPassword } = this.state;

    if (confirmPassword.length === 0) {
      return this.setState({ confirmPasswordError: true });
    }

    if (password !== confirmPassword) {
      return this.setState({ passwordError: true, confirmPasswordError: 'Passwords must match' });
    }

    this.setState({ passwordError: false, confirmPasswordError: false, signingUp: true});

    this.props
      .signup(firstName, lastName, email, password)
      .then(({ data }) => {
        this.setState({ signingUp: false });
        return this.props.screenProps.changeLoginState(true, data.signup.jwt);
      })
      .catch(e => {
        this.setState({ signingUp: false });

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
    const { navigation } = this.props;
    const { emailError, passwordError, password, email, firstName, lastName, confirmPassword, confirmPasswordError, signingUp } = this.state;

    let disabled = true;

    if (email.length > 0
      && firstName.length > 0 
      && lastName.length > 0 
      && password.length >= 6 && validator.isEmail(email) 
      && password === confirmPassword) {
        disabled = false;
      }

    const manifest = Constants.manifest;
    const buildNumber = manifest.ios.buildNumber;
    const version = manifest.version;
    const releaseChannel = manifest.releaseChannel;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={[ContainerStyles.header]}></Header>

        <Content padder style={ContainerStyles.content}>
          <View style={[CardStyles.card, {paddingBottom: 20}]}>
            {emailError && <GenericError message={emailError} style={{marginLeft: 10}} />}
            {passwordError && <GenericError message={passwordError} style={{marginLeft: 10}} />}
            {confirmPasswordError && <GenericError message={confirmPasswordError} style={{marginLeft: 10}} />}
            <Card transparent>
              <Form>
                <Item>
                  <Input
                    onChangeText={value => this.handleInputChange('firstName', value)}
                    autoCorrect={false}
                    placeholder="first name"
                  />
                </Item>
                <Item>
                  <Input
                    onChangeText={value => this.handleInputChange('lastName', value)}
                    autoCorrect={false}
                    placeholder="last name"
                  />
                </Item>
                <Item>
                  <Input
                    onChangeText={value => this.handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="email"
                  />
                </Item>
                <Item>
                  <Input
                    onChangeText={value => this.handleInputChange('password', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    placeholder="password (minimum 6 characters)"
                  />
                </Item>
                <Item last>
                  <Input
                    onChangeText={value => this.handleInputChange('confirmPassword', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    placeholder="confirm password"
                  />
                </Item>
              </Form>
            </Card>
          </View>

          <Text style={{fontSize: 12, color: 'grey', marginTop: 10}}>By signing up you will be agreeing to our Terms of Service</Text>
          <Button style={{paddingLeft: 0, marginLeft: 0}} transparent onPress={() => WebBrowser.openBrowserAsync(apiEndpointTerms)}>
            <Text style={{fontSize: 14, fontFamily: 'montserrat-bold', paddingLeft: 0}}>View Terms of Service</Text>
          </Button>

          {/* <CardList
              data={[
                {
                  _id: apiEndpoint,
                  title: "apiEndpoint:",
                  subtitle: apiEndpoint
                },
                {
                  _id: manifest.sdkVersion,
                  title: "sdkVersion:",
                  subtitle: manifest.sdkVersion
                },
                {
                  _id: version,
                  title: "version:",
                  subtitle: version
                },
                {
                  _id: buildNumber,
                  title: "buildNumber:",
                  subtitle: buildNumber
                },
                {
                  _id: releaseChannel,
                  title: "releaseChannel:",
                  subtitle: releaseChannel
                } 
              ]}
              rightActionItem={<View></View>}
            /> */}
          
          <GradientButton
            disabled={disabled}
            title={signingUp ? <Text style={TypographyStyles.buttonText}><ActivityIndicator size="small" color={Colors.White} /> Signing Up</Text> : "Sign Up"}
            fill
            buttonProps={{
              onPress: () => this.handleSubmit()
            }}
          />

          <Button 
            block 
            style={ButtonStyles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={ButtonStyles.secondaryButtonText}>Login</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default graphql(
  gql`
    mutation SignUp($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
      signup(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
        _id
        firstName
        lastName
        email
        jwt
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      signup: (firstName, lastName, email, password) => mutate({ variables: { firstName, lastName, email, password } }),
    }),
  },
)(Register);
