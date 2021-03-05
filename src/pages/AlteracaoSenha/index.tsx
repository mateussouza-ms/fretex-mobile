import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Overlay } from "react-native-elements";

import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

import { max, obrigatorio } from "../../valiadacao/validators";

import styles from "./styles";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/auth";

function AlteracaoSenha() {
  const navigation = useNavigation();
  const { usuarioLogado } = useAuth();

  const [loading, setLoading] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novaSenhaConfirm, setNovaSenhaConfirm] = useState("");

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [formSubmetido, setFormSubmetido] = useState(false);

  const [senhaAtualInvalida, setSenhaAtualInvalida] = useState("");

  const errors = {
    senhaAtual:
      obrigatorio(senhaAtual) || max(senhaAtual, 120) || senhaAtualInvalida,
    novaSenha:
      obrigatorio(novaSenha) ||
      max(novaSenha, 120) ||
      novaSenha !== novaSenhaConfirm
        ? "Senhas diferentes"
        : null,
    novaSenhaConfirm:
      obrigatorio(novaSenhaConfirm) ||
      max(novaSenhaConfirm, 120) ||
      novaSenhaConfirm !== novaSenha
        ? "Senhas diferentes"
        : null,
  };

  const formPreenchido =
    senhaAtual !== "" && novaSenha !== "" && novaSenhaConfirm !== "";
  const formValido =
    !errors.senhaAtual && !errors.novaSenha && !errors.novaSenhaConfirm;

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  function handleSubmit() {
    setFormSubmetido(true);

    if (!formValido) {
      return;
    }

    setLoading(true);
    api
      .put(`usuarios/${usuarioLogado?.id}/senha`, {
        senhaAtual,
        novaSenha,
      })
      .then(() => {
        setLoading(false);
        Alert.alert(
          "Sucesso!",
          "Senha atualizada com sucesso. ",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
          { cancelable: true }
        );
      })
      .catch((error) => {
        setLoading(false);
        const { titulo } = error.response.data;
        if (
          titulo ===
          "Senha atual informada não coincide com a senha do usuário."
        ) {
          setSenhaAtualInvalida("Senha incorreta");
        } else {
          setErroApi(JSON.stringify(error.response.data));
          toggleOverlay();
        }
      });
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Alteração de senha" />
      <Text style={styles.label}>
        Senha atual: *
        {formSubmetido && errors.senhaAtual && (
          <Text style={styles.textoValidacao}>{`\b${errors.senhaAtual}`}</Text>
        )}
      </Text>
      <TextInput
        style={[
          styles.input,
          formSubmetido && errors.senhaAtual ? styles.inputError : null,
        ]}
        value={senhaAtual}
        onChangeText={(text) => {
          setSenhaAtual(text);
          setSenhaAtualInvalida("");
        }}
        placeholder="Informe a senha atual"
        maxLength={120}
        secureTextEntry
      />

      <Text style={styles.label}>
        Nova senha: *
        {formSubmetido && errors.novaSenha && (
          <Text style={styles.textoValidacao}>{`\b${errors.novaSenha}`}</Text>
        )}
      </Text>

      <TextInput
        style={[
          styles.input,
          formSubmetido && errors.novaSenha ? styles.inputError : null,
        ]}
        value={novaSenha}
        onChangeText={(text) => setNovaSenha(text)}
        placeholder="Informe a nova senha"
        maxLength={120}
        secureTextEntry
      />

      <Text style={styles.label}>
        Confirmação da nova senha:
        {formSubmetido && errors.novaSenhaConfirm && (
          <Text style={styles.textoValidacao}>
            {`\b${errors.novaSenhaConfirm}`}
          </Text>
        )}
      </Text>

      <TextInput
        style={[
          styles.input,
          formSubmetido && errors.novaSenhaConfirm ? styles.inputError : null,
        ]}
        value={novaSenhaConfirm}
        onChangeText={(text) => setNovaSenhaConfirm(text)}
        placeholder="Repita a nova senha"
        maxLength={120}
        secureTextEntry
      />

      <RectButton
        enabled={formPreenchido}
        style={[styles.button, !formPreenchido ? styles.buttonDisabled : null]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Salvar</Text>
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

export default AlteracaoSenha;
