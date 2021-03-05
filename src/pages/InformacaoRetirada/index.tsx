import React, { useState } from "react";
import { View, ScrollView, Text, TextInput, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Overlay } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

import styles from "./styles";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/auth";

function InformacaoRetirada({ route }: any) {
  const { usuarioLogado } = useAuth();
  const { carga } = route.params;
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [showDatePickerRetirada, setShowDatePickerRetirada] = useState(false);
  const [tipoDatePiker, settipoDatePiker] = useState<
    "time" | "date" | "datetime" | "countdown" | undefined
  >("date");

  const [dataRetirada, setDataRetirada] = useState<Date | null>(new Date());

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);

  const formPreenchido = dataRetirada != null;

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  function handleSubmit() {
    setLoading(true);
    api
      .put(`cargas/${carga.id}/dataRetirada`, {
        dataHora: dataRetirada,
      })
      .then((response) => {
        Alert.alert("Sucesso!", "Informação salva com sucesso.", [
          {
            text: "OK",
            onPress: () => {
              navigate("DetalhesCarga", {
                carga: response.data,
                usuarioLogado,
              });
            },
          },
        ]);
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      })
      .finally(() => setLoading(false));
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Informar retirada de carga" />

      <ScrollView style={styles.scrollCampos}>
        <Text style={styles.label}>Data de retirada: *</Text>
        <TextInput
          style={styles.input}
          value={
            dataRetirada
              ? format(new Date(dataRetirada.toString()), "dd/MM/yyyy HH:mm")
              : ""
          }
          placeholder="Data que a carga foi retirada"
          onTouchEnd={() => setShowDatePickerRetirada(true)}
        />

        {showDatePickerRetirada && (
          <DateTimePicker
            value={dataRetirada || new Date()}
            mode={tipoDatePiker}
            display="default"
            onChange={(event, date) => {
              setShowDatePickerRetirada(false);
              if (event.type === "set") {
                if (date) {
                  setDataRetirada(date);
                  if (tipoDatePiker === "date") {
                    settipoDatePiker("time");
                    setShowDatePickerRetirada(true);
                  } else {
                    settipoDatePiker("date");
                  }
                }
              }
            }}
            maximumDate={new Date()}
          />
        )}

        <RectButton
          enabled={formPreenchido}
          style={[
            styles.button,
            !formPreenchido ? styles.buttonDisabled : null,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Confirmar retirada</Text>
        </RectButton>
      </ScrollView>

      <Loader loading={loading} />

      <Overlay
        overlayStyle={{ width: "90%" }}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <Text style={{ lineHeight: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {`Erro ao consumir API: \n`}
          </Text>
          <Text>{erroApi}</Text>
        </Text>
      </Overlay>
    </View>
  );
}

export default InformacaoRetirada;
