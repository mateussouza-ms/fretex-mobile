import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Overlay } from "react-native-elements";

import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

import { obrigatorio, isEmail } from "../../valiadacao/validators";

import styles from "./styles";
import Loader from "../../components/Loader";

function RecuperacaoSenha() {
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [formSubmetido, setFormSubmetido] = useState(false);

  const errors = {
    email: obrigatorio(email) || isEmail(email),
  };

  const formPreenchido = email !== "";
  const formValido = !errors.email;

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  function handleSubmit() {
    setLoading(true);

    setFormSubmetido(true);

    if (!formValido) {
      return;
    }

    api
      .post("usuarios/recuperacao-senha", { email })
      .then(() => {
        setLoading(false);
        navigate("RedefinicaoSenha");
      })
      .catch((error) => {
        setLoading(false);
        if (error.message === "Request failed with status code 404") {
          Alert.alert(
            "E-mail não cadastrado",
            "Não existe nenhum usuário cadastrado com o e-mail informado.",
            [
              {
                text: "OK",
              },
            ]
          );
        } else {
          setErroApi(JSON.stringify(error));
          toggleOverlay();
        }
      });
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Recuperação de senha" />

      <Text style={styles.title}>
        <Text>
          Para recuperar sua senha, informe abaixo o e-mail cadastrado.
        </Text>
      </Text>
      <Text style={styles.label}>
        E-mail: *
        {formSubmetido && errors.email && (
          <Text style={styles.textoValidacao}>{`\b${errors.email}`}</Text>
        )}
      </Text>
      <TextInput
        style={[
          styles.input,
          formSubmetido && errors.email ? styles.inputError : null,
        ]}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="E-mail"
        keyboardType="email-address"
      />

      <RectButton
        enabled={formPreenchido}
        style={[styles.button, !formPreenchido ? styles.buttonDisabled : null]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Enviar</Text>
      </RectButton>

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

export default RecuperacaoSenha;
