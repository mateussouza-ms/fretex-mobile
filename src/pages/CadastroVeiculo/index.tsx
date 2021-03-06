import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Overlay } from "react-native-elements";

import { Picker } from "@react-native-community/picker";
import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

import { max, obrigatorio, min } from "../../valiadacao/validators";

import styles from "./styles";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/auth";

const CadastroVeiculo: React.FC = () => {
  const { usuarioLogado, adicionarPerfil } = useAuth();
  const [novoPrestador, setNovoPrestador] = useState(false);
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [nome, setNome] = useState("");
  const [placa, setPlaca] = useState("");
  const [pesoMaximo, setPesoMaximo] = useState("");
  const [outrasCaracteristicas, setOutrasCaracteristicas] = useState("");

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [formSubmetido, setFormSubmetido] = useState(false);

  const errors = {
    tipoVeiculo:
      tipoVeiculo !== "Outros" &&
      (obrigatorio(tipoVeiculo) || max(tipoVeiculo, 30)),
    nome: tipoVeiculo === "Outros" && (obrigatorio(nome) || max(nome, 30)),
    placa: obrigatorio(placa) || min(placa, 7) || max(placa, 7),
    pesoMaximo: obrigatorio(pesoMaximo) || min(pesoMaximo, 0),
  };

  const formPreenchido =
    ((tipoVeiculo === "Outros" && nome !== "") ||
      (tipoVeiculo !== "Outros" && tipoVeiculo !== "")) &&
    placa !== "" &&
    pesoMaximo !== "";

  const formValido =
    !errors.tipoVeiculo && !errors.nome && !errors.placa && !errors.pesoMaximo;

  useEffect(() => {
    usuarioLogado?.perfis.forEach((perfil) => {
      if (perfil.perfil === "PRESTADOR_SERVICOS") {
        setNovoPrestador(true);
      }
    });
  });

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function novoPrestadorServico() {
    setLoading(true);
    await api
      .post(`usuarios/${usuarioLogado?.id}/perfil/prestador-servico`, {
        veiculo: {
          nome: tipoVeiculo === "Outros" ? nome : tipoVeiculo,
          placa,
          pesoMaximo,
          outrasCaracteristicas,
        },
      })
      .then((response) => {
        adicionarPerfil({ id: response.data.id, perfil: "PRESTADOR_SERVICOS" });
        setTipoVeiculo("");
        setNome("");
        setPlaca("");
        setPesoMaximo("");
        setOutrasCaracteristicas("");
        setFormSubmetido(false);
        setNovoPrestador(false);
        navigate("Inicial");
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      });
    setLoading(false);
  }

  async function adicionarVeiculo() {
    setLoading(true);
    await api
      .post(`usuarios/${usuarioLogado?.id}/perfil/prestador-servico/veiculos`, {
        nome: tipoVeiculo === "Outros" ? nome : tipoVeiculo,
        placa,
        pesoMaximo,
        outrasCaracteristicas,
      })
      .then(() => {
        Alert.alert(
          "Sucesso!",
          `Veículo [${
            tipoVeiculo === "Outros" ? nome : tipoVeiculo
          }] adicionado com sucesso.`,
          [{ text: "OK" }],
          { cancelable: true }
        );
        setTipoVeiculo("");
        setNome("");
        setPlaca("");
        setPesoMaximo("");
        setOutrasCaracteristicas("");
        setFormSubmetido(false);
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      });
    setLoading(false);
  }

  function handleSubmit() {
    setFormSubmetido(true);

    if (!formValido) {
      return;
    }

    if (novoPrestador) {
      novoPrestadorServico();
    } else {
      adicionarVeiculo();
    }
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Cadastro de veículo" />

      {novoPrestador && (
        <Text style={styles.title}>
          Para se cadastrar como prestador de serviços, informe abaixo os dados
          do seu veículo:
        </Text>
      )}
      <ScrollView style={styles.scrollCampos}>
        <Text style={styles.label}>
          Tipo de veículo: *
          {formSubmetido && errors.nome && (
            <Text style={styles.textoValidacao}>{`\b${errors.nome}`}</Text>
          )}
        </Text>
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={tipoVeiculo}
            onValueChange={(itemValue) => setTipoVeiculo(itemValue.toString())}
            mode="dropdown"
          >
            <Picker.Item
              color="gray"
              value=""
              label="Selecione o tipo de veículo"
            />
            <Picker.Item value="Motoneta" label="Motoneta" />
            <Picker.Item value="Motocicleta" label="Motocicleta" />
            <Picker.Item value="Triciclo" label="Triciclo" />
            <Picker.Item value="Quadriciclo" label="Quadriciclo" />
            <Picker.Item value="Caminhonete" label="Caminhonete" />
            <Picker.Item value="Caminhão" label="Caminhão" />
            <Picker.Item
              value="Reboque ou semi-reboque"
              label="Reboque ou semi-reboque"
            />
            <Picker.Item value="Outros" label="Outros" />
          </Picker>
        </View>

        {tipoVeiculo === "Outros" && (
          <TextInput
            style={[
              styles.input,
              formSubmetido && errors.nome ? styles.inputError : null,
            ]}
            value={nome}
            onChangeText={(text) => setNome(text)}
            placeholder="Informe aqui o tipo do veículo"
          />
        )}

        <Text style={styles.label}>
          Placa: *
          {formSubmetido && errors.placa && (
            <Text style={styles.textoValidacao}>{`\b${errors.placa}`}</Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.placa ? styles.inputError : null,
          ]}
          value={placa}
          onChangeText={(text) => setPlaca(text)}
          onBlur={() => setPlaca(placa.toUpperCase())}
          placeholder="Placa (somente letras e números)"
          maxLength={7}
        />

        <Text style={styles.label}>
          Peso máximo de carga: *
          {formSubmetido && errors.pesoMaximo && (
            <Text style={styles.textoValidacao}>
              {`\b${errors.pesoMaximo}`}
            </Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.pesoMaximo ? styles.inputError : null,
          ]}
          value={pesoMaximo}
          onChangeText={(text) => setPesoMaximo(text)}
          placeholder="Peso máximo de carga (Kg)"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Outras características:</Text>
        <TextInput
          style={styles.input}
          value={outrasCaracteristicas}
          onChangeText={(text) => setOutrasCaracteristicas(text)}
          placeholder="Demais características do veículo"
        />

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
};

export default CadastroVeiculo;
