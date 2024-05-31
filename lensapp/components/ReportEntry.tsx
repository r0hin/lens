import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {VENDORS_8} from '../utils/settings';

const ReportEntry = (props: any) => {
  const {vendor, score, date} = props;

  return (
    <View
      style={{
        backgroundColor: '#121315',
        borderRadius: 8,
        padding: 12,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#5371FF',
            borderRadius: 4,
            width: 42,
            height: 42,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
          <Icon
            style={{}}
            name={VENDORS_8[vendor]?.logo || 'dollar-sign'}
            size={22}
            color="white"
          />
        </View>
        <View>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 500}}>
            {VENDORS_8[vendor]?.name}
          </Text>
          <Text style={{color: '#a3a3a3', fontSize: 13, paddingTop: 4}}>
            {date}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {score > 0 ? (
          <Text style={{color: '#5371FF', fontSize: 16, marginRight: 8}}>
            +{score}
          </Text>
        ) : (
          <Text style={{color: 'red', fontSize: 16, marginRight: 8}}>
            {score}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ReportEntry;
