import React from "react";
import { View, Modal, ActivityIndicator } from "react-native";

import styles from "./styles";

const Loader = (props: { loading: boolean }) => {
  const { loading } = props;

  return (
    <Modal transparent animationType="none" visible={loading}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={loading} color="#6495ED" size="large" />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
