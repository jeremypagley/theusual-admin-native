import React from 'react';
import ActivityContainer from 'app/containers/Activity';

class Activity extends React.Component {
  static navigationOptions = {
    title: 'Activity',
  };

  render() {
    return (
      <ActivityContainer {...this.props} />
    );
  }
}

export default Activity;
