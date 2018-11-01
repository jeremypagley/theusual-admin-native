import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ProfileContainer from 'app/containers/Profile';

class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  handleLogout = () => {
    return this.props.screenProps.changeLoginState(false);
  };

  render() {
    return (
      <ProfileContainer onLogout={this.handleLogout} data={this.props.data} />
    );
  }
}

export default graphql(
  gql`
    query User {
      currentUser {
        _id
        email
        firstName
        lastName
      }
    }
  `
)(Profile);
