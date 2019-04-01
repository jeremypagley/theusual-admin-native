import React from 'react';
import { 
  Text,
  Body,
  H2,
  Left,
  Right,
  View,
  Card, 
  CardItem,
  Icon,
  Badge,
  Spinner
} from 'native-base';
import { Dimensions } from 'react-native';
import { Row } from 'react-native-easy-grid';
import ExpandableCardStyles from 'app/styles/ExpandableCardStyles';
import TypographyStyles from 'app/styles/generic/TypographyStyles';
import CardStyles from 'app/styles/generic/CardStyles';
import PropTypes from 'prop-types';
import Colors from 'app/styles/Colors';

const screenWidth = Dimensions.get('window').width;

class ExpandableCard extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string)
    })),
    onActionPress: PropTypes.func,
    removable: PropTypes.bool,
    removableOnPress: PropTypes.func,
    keyId: PropTypes.string,
    statusColor: PropTypes.string
  }

  render() {
    const {
      title,
      actionTitle,
      onActionPress,
      removableOnPress,
      removable,
      actionLoading,
      actionLoadingTitle,
      items,
      statusColor,
      statusTitle,
      tipColor,
      tipTitle,
    } = this.props;

    let actionTitleNode = !actionLoading ? <Text style={CardStyles.itemButtonTitle}>{actionTitle}</Text> :(
      <View>
        <Text style={CardStyles.itemButtonTitle}>{actionLoadingTitle}</Text>
        <View style={{position: 'absolute', top: -30, left: -40}}><Spinner color={Colors.BrandRed} /></View>
      </View>
    );
    
    return (
      <View style={CardStyles.card}>
        <Card transparent>
          {title ? 
          <CardItem header style={CardStyles.itemHeader}>
            <View>{title}</View>
            <Left />
            {removable ?
            <Right style={{marginLeft: -15}}>
              <Icon name="md-close" style={{fontSize: 30, color: Colors.BrandGrey}} onPress={removableOnPress} />
            </Right>
            : null}
          </CardItem>
          : null}

          {items.map((item, index) => {
            return (
              <CardItem key={item.title}>
                <Body>
                  <Row>
                    <H2 style={TypographyStyles.semiBoldH2}>{item.title}</H2>
                  </Row>
                  <View style={{flexDirection: 'row', width: screenWidth-80, flexWrap: 'wrap'}}>
                    {this.getItemOptions(item.options)}
                  </View>
                </Body>
                <Right>
                  {removable && !title && index === 0 ? 
                    <Icon name="md-close" style={{fontSize: 30, color: Colors.BrandGrey}} onPress={removableOnPress} />
                  : null}
                </Right>
              </CardItem>
            )
          })}

          {tipColor && tipTitle
           ? <CardItem style={[CardStyles.cardTipIndicator, actionTitle ? {bottom: 70} : {}]}>
              <Badge style={[{ backgroundColor: tipColor}]}>
                <Text style={CardStyles.cardStatusText}>{tipTitle}</Text>
              </Badge>
            </CardItem>
          : null}

          {statusColor && statusTitle
           ? <CardItem style={[CardStyles.cardStatusIndicator, actionTitle ? {bottom: 40} : {}]}>
              <Badge style={[{ backgroundColor: statusColor}]}>
                <Text style={CardStyles.cardStatusText}>{statusTitle}</Text>
              </Badge>
            </CardItem>
          : null}

          {onActionPress && actionTitle ? 
          <CardItem footer button onPress={onActionPress} style={CardStyles.itemFooter}>
            <Left />
            <Right>
              {actionTitleNode}
            </Right>
          </CardItem>
          : null}
        </Card>
      </View>
    );
  }

  getItemOptions = (options) => {
    return options.map((option, index) => {
      return (
        <View
          style={ExpandableCardStyles.optionWrapper}
          key={`${option}${index}`}
        >
          <Text style={TypographyStyles.note}>{option}, </Text>
        </View>
      )
    });
  }

}

export default ExpandableCard;
