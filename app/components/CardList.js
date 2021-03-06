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
    rightActionItem: PropTypes.element
  }

  static defaultProps = {
    flatListProps: {},
    cardFooter: null
  }

  _keyExtractor = (item, index) => item._id;

  _renderItem = ({item}) => {
    const { rightActionItem, hasNavIcon, smallTitle } = this.props;
    if (!item) return null;

    const disabled = item.disabled;
    const disabledReasonText = item.disabledReasonText;
    const disabledStyles = disabled ? {color: Colors.BrandDarkGrey} : {};

    return (
      <ListItem 
        onPress={() => {
          if (!disabled && this.props.handleItemPress) this.props.handleItemPress(item);
        }}
        key={item._id}
      >
        <Body>
          <Text style={[TypographyStyles.listItemTitle, smallTitle ? {fontSize: 18} : {}, disabledStyles]}>{item.title}</Text>
          {item.subtitle ? <Text style={[TypographyStyles.noteListItem, disabledStyles]}>{item.subtitle}</Text> : null}
          {item.noteTitle ? <Text style={[TypographyStyles.noteListItem, disabledStyles]}>{item.noteTitle}</Text> : null}
          {disabled ? <Text style={[TypographyStyles.noteListItem, disabledStyles]}>{disabledReasonText}</Text> : null}
        </Body>
        <Right>
          {rightActionItem ? rightActionItem : <Icon name="arrow-forward" style={{fontSize: 30, color: Colors.BrandRed}} />}
        </Right>
        {rightActionItem && hasNavIcon ?
        <Right>
          <Icon name="arrow-forward" style={{fontSize: 30, color: Colors.BrandRed}} />
        </Right> : null}
      </ListItem>
    );
  }

  render() {
    const { title, subtitle, flatListProps, cardFooter } = this.props;
    const titleNode = title ? (
      <CardItem header style={CardStyles.itemHeader}>
        <Left>
          <Text style={TypographyStyles.listTitle}>{title}</Text>
        </Left>
      </CardItem>
    ) : null;

    const subtitleNode = subtitle ? (
      <CardItem header style={CardStyles.itemHeader}>
        <Left>
          <Text style={TypographyStyles.listSubtitle}>{subtitle}</Text>
        </Left>
      </CardItem>
    ) : null;

    return (
      <View style={CardStyles.card}>
        <Card transparent>
          {titleNode}
          {subtitleNode}

          <FlatList
            data={this.props.data}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            {...flatListProps}
          />

          {cardFooter}
        </Card>
      </View>
    );
  }
}

export default CardList;
