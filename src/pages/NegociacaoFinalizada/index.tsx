import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";

import PageHeader from "../../components/PageHeader";

import styles from "./styles";

function NegociacaoFinalizada() {
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <PageHeader title="Negociacao finalizada" />

      <View style={styles.body}>
        <Text style={styles.title}>
          Negociação finalizada! {"\n"}
          <Text style={styles.subtitle}>
            Em breve o transportador irá pegar sua carga.
          </Text>
        </Text>
      </View>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigate("Inicial")}>
          <Text style={styles.textLink}>Voltar para a página inicial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default NegociacaoFinalizada;
