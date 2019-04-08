import React, { Component } from 'react';
import {
  View,
  Dimensions
} from 'react-native';
import { Text } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Colors from 'app/styles/Colors';
// import ColorUtil from 'app/lib/color';
let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

/**
 * MultiSelect is does not support SectionedMultiSelect sections
 * you will see when we map out the customChipsRenderer we only map out
 * the children of the first section.
 */
export default class MultiSelect extends Component {
  render() {
    return (
      <View>
        <SectionedMultiSelect
          uniqueKey='id'
          subKey='children'
          showDropDowns={false}
          readOnlyHeadings
          showCancelButton
          modalWithSafeAreaView
          modalWithTouchable
          styles={{
            selectToggle: {
              borderBottomColor: Colors.BrandBorderGrey,
              borderRadius: 5,
              borderBottomWidth: 1,
              paddingTop: 10,
              paddingRight: 10,
              paddingBottom: 10,
              paddingLeft: 0,
              marginLeft: 15,
              marginTop: 5
            },
            selectToggleText: {
              fontFamily: 'montserrat-medium',
              color: Colors.BrandBlack,
              fontSize: 16,
              paddingLeft: 10
            },
            subItemText: {
              fontFamily: 'montserrat-regular',
              color: Colors.BrandBlack,
              fontSize: 14
            },
            selectedSubItemText: {
              fontFamily: 'montserrat-semibold',
              color: Colors.BrandRed,
              fontSize: 14
            },
            scrollView: {
              maxHeight: screenHeight-300
            },
            listContainer: {
              maxHeight: screenHeight-300
            },
            container: {
              maxHeight: screenHeight-300,
              marginTop: screenHeight-580
            },
            chipText: {
              fontSize: 14,
              fontFamily: 'montserrat-medium',
            },
            chipsWrapper: {
              marginLeft: 15,
              marginTop: 5
            }
          }}
          colors={{
            primary: Colors.BrandRed,
            chipColor: Colors.BrandBlack,
            success: Colors.BrandRed,
          }}
          // customChipsRenderer={({uniqueKey, subKey, displayKey, items, selectedItems, colors, styles}) => {
          //   if (!selectedItems) return <View></View>;
          //   return (
          //     <View style={{flexDirection: 'row', flexWrap: 'wrap', maxWidth: screenWidth-50, marginLeft: 15}}>
          //       {selectedItems.map(id => {
          //         const item = items[0].children.find(itm => itm.id === id);
          //         return item ? (
          //           <View
          //             key={id} 
          //             onPress={() => this.props.onSelectedItemsChange()} 
          //             style={{ 
          //               backgroundColor: Colors.BrandGrey,
          //               padding: 5,
          //               borderRadius: 5,
                        
          //               marginLeft: 0, 
          //               marginRight: 10, 
          //               marginTop: 10,
          //               flexDirection: 'column'
          //             }}
          //           >
          //             <Text style={{color: item.color, fontFamily: 'montserrat-medium'}}>{item.name}</Text>
          //           </View>
          //         ) : null;
          //       })}
          //     </View>
          //   )
          // }}
          {...this.props}
        />
      </View>
    );
  }
}
