import React, { Component } from 'react';
import {
  View,
  Modal,
  ActivityIndicator
} from 'react-native';

import styles from './styles';

const Loader = (props: { loading: boolean; }) => {
  const {
    loading
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading} color='#6495ED' size="large"  />
        </View>
      </View>
    </Modal>
  )
}

export default Loader;