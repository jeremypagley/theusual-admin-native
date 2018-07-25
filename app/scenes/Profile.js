import React from 'react';
import { View } from 'react-native';
import { Container, Text, Button, Content } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Logout extends React.Component {
  handleLogout = () => {
    return this.props.screenProps.changeLoginState(false);
  };

  render() {
    const { currentUser } = this.props.data;

    return (
      <Container>
        <Content>
          {currentUser &&
            <View>
              <Text>{currentUser._id}</Text>
              <Text>{currentUser.email}</Text>
            </View>
          }
          <Button full onPress={this.handleLogout}>
            <Text>Log Out</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default graphql(
  gql`
    query User {
      currentUser {
        _id
        email
      }
    }
  `
)(Logout);
