import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Overlay } from "react-native-elements";

import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import { max, obrigatorio, isEmail, min } from "../../valiadacao/validators";
import api from "../../services/api";
import { useAuth } from "../../contexts/auth";
import styles from "./styles";

function AtualizacaoCadastro() {
  const [loading, setLoading] = useState(false);
  const { usuarioLogado, setUsuarioLogado } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnp, setCnp] = useState("");
  const [telefoneDdd, setTelefoneDdd] = useState("");
  const [telefoneNumero, setTelefoneNumero] = useState("");

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [formSubmetido, setFormSubmetido] = useState(false);

  const errors = {
    nome: obrigatorio(nome) || max(nome, 120),
    cnp: obrigatorio(cnp) || min(cnp, 11) || max(cnp, 14),
    email: obrigatorio(email) || isEmail(email),
    telefoneDdd:
      obrigatorio(telefoneDdd) || min(telefoneDdd, 2) || max(telefoneDdd, 2),
    telefoneNumero:
      obrigatorio(telefoneNumero) ||
      min(telefoneNumero, 8) ||
      max(telefoneNumero, 9),
  };

  const formPreenchido =
    nome !== "" &&
    cnp !== "" &&
    email !== "" &&
    telefoneDdd !== "" &&
    telefoneNumero !== "";

  const formValido =
    !errors.nome &&
    !errors.cnp &&
    !errors.email &&
    !errors.telefoneDdd &&
    !errors.telefoneNumero;

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (usuarioLogado) {
      setLoading(true);
      api
        .get(`usuarios/${usuarioLogado.id}`)
        .then((response) => {
          const usuario = response.data;

          setNome(usuario.nome);
          setCnp(usuario.cnp);
          setEmail(usuario.email);
          setTelefoneDdd(usuario.telefone.ddd);
          setTelefoneNumero(usuario.telefone.numero);
          setLoading(false);
        })
        .catch((error) => {
          setErroApi(JSON.stringify(error.response.data));
          toggleOverlay();
          setLoading(false);
        });
    }
  }, [usuarioLogado]);

  async function handleSubmit() {
    setFormSubmetido(true);

    if (!formValido) {
      return;
    }

    let tipoPessoa = "FÍSICA";

    if (cnp.length > 11) {
      tipoPessoa = "JURÍDICA";
    }

    setLoading(true);
    await api
      .put(`usuarios/${usuarioLogado?.id}`, {
        nome,
        cnp,
        tipoPessoa,
        email,
        telefone: {
          ddd: telefoneDdd,
          numero: telefoneNumero,
        },
      })
      .then((response) => {
        if (usuarioLogado) {
          setUsuarioLogado({
            id: usuarioLogado.id,
            nome: response.data.nome,
            perfis: usuarioLogado.perfis,
            perfilSelecionado: usuarioLogado.perfilSelecionado,
          });
        }

        Alert.alert(
          "Sucesso!",
          "Cadastro atualizado com sucesso.",
          [{ text: "OK" }],
          { cancelable: true }
        );
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      });
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Atualização de cadastro" />

      <ScrollView style={styles.scrollCampos}>
        <Text style={styles.label}>
          Nome completo: *
          {formSubmetido && errors.nome && (
            <Text style={styles.textoValidacao}>{`\b${errors.nome}`}</Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.nome ? styles.inputError : null,
          ]}
          value={nome}
          onChangeText={(text) => setNome(text)}
          placeholder="Nome"
          maxLength={120}
        />

        <Text style={styles.label}>
          PF/CNPJ: *
          {formSubmetido && errors.cnp && (
            <Text style={styles.textoValidacao}>{`\b${errors.cnp}`}</Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.cnp ? styles.inputError : null,
          ]}
          value={cnp}
          onChangeText={(text) => setCnp(text)}
          placeholder="CPF/CNPJ"
          keyboardType="numeric"
          maxLength={14}
        />

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

        <Text style={styles.label}>
          Telefone: *
          {formSubmetido && errors.telefoneDdd && (
            <Text style={styles.textoValidacao}>
              {` DDD ${errors.telefoneDdd}`}
            </Text>
          )}
          {formSubmetido && errors.telefoneDdd && errors.telefoneNumero && (
            <Text style={styles.textoValidacao}>{" |"}</Text>
          )}
          {formSubmetido && errors.telefoneNumero && (
            <Text style={styles.textoValidacao}>
              {` Número ${errors.telefoneNumero}`}
            </Text>
          )}
        </Text>
        <View style={styles.inputGroup}>
          <View style={styles.inputDdd}>
            <TextInput
              style={[
                styles.input,
                formSubmetido && errors.telefoneDdd ? styles.inputError : null,
              ]}
              value={telefoneDdd}
              onChangeText={(text) => setTelefoneDdd(text)}
              placeholder="DDD"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={styles.inputNumero}>
            <TextInput
              style={[
                styles.input,
                formSubmetido && errors.telefoneNumero
                  ? styles.inputError
                  : null,
              ]}
              value={telefoneNumero}
              onChangeText={(text) => setTelefoneNumero(text)}
              placeholder="Número"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>
        </View>

        <RectButton
          enabled={formPreenchido}
          style={[
            styles.button,
            !formPreenchido ? styles.buttonDisabled : null,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Salvar</Text>
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

export default AtualizacaoCadastro;
