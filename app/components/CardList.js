import React from 'react';
import {
  FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import {
  ListItem,
  Card,
  CardItem,
  Text,
  View,
  Icon,
  H3,
  Body,
  Left,
  Right
} from 'native-base';
import CardStyles from 'app/styles/generic/CardStyles';
import Colors from 'app/styles/Colors';
import TypographyStyles from 'app/styles/generic/TypographyStyles';

class CardList extends React.PureComponent {

  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string
      })  
    ),
    listTitle: PropTypes.string,
    handleItemPress: PropTypes.func,
  }

  _keyExtractor = (item, index) => item._id;

  // _onPressItem = (id: string) => {
  //   // updater functions are preferred for transactional updates
  //   this.setState((state) => {
  //     // copy the map rather than modifying state.
  //     const selected = new Map(state.selected);
  //     selected.set(id, !selected.get(id)); // toggle
  //     return {selected};
  //   });
  // };

  _renderItem = ({item}) => {
    return (
      <ListItem onPress={() => this.props.handleItemPress(item)}>
        <Body>
          <Text style={TypographyStyles.listItemTitle}>{item.title}</Text>
          <Text style={TypographyStyles.noteListItem}>{item.subtitle}</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" style={{fontSize: 30, color: Colors.BrandRed}} />
        </Right>
      </ListItem>
    );
  }

  render() {
    const { title } = this.props;

    console.log(this.props.data)

    return (
      <View style={CardStyles.card}>
        <Card transparent>
          <CardItem header style={CardStyles.itemHeader}>
            <Left>
              <Text style={TypographyStyles.listTitle}>{title}</Text>
            </Left>
          </CardItem>

          <FlatList
            data={this.props.data}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </Card>
      </View>
    );
  }
}

export default CardList;
