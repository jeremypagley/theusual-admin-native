import React from 'react';
import { 
  Container,
  Content,
  Header,
  View
} from 'native-base';
import ContainerStyles from 'app/styles/generic/ContainerStyles';
import GradientButton from 'app/components/GradientButton';
import CardList from 'app/components/CardList';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GenericError from 'app/components/GenericError';

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser, loading, error } = this.props.data;

    return (
      <Container style={ContainerStyles.container}>
        <Header style={[ContainerStyles.header]}></Header>

        <Content padder style={ContainerStyles.content}>
          {loading && <LoadingIndicator title="Loading stores" />}
          {error && <GenericError message={error.message} />}

          {loading || error 
          ? null
          : <CardList
              data={[{
                _id: currentUser._id,
                title: `${currentUser.firstName} ${currentUser.lastName}`,
                subtitle: currentUser.email
              }]}
              rightActionItem={<View></View>}
            />
          }

          <GradientButton 
            title="Logout"
            buttonProps={{onPress: () => this.props.onLogout()}}
          />

        </Content>
      </Container>
    );
  }

}

export default ProfileContainer;
