import React, { useState } from "react";
import { View, ScrollView, Text, TextInput } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Overlay } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

import { max, obrigatorio, min } from "../../valiadacao/validators";

import styles from "./styles";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/auth";

function CadastroProposta({ route }: any) {
  const { usuarioLogado } = useAuth();
  const { carga, negociacaoId, novaNegociacao, veiculoId } = route.params;
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [showDatePickerRetirada, setShowDatePickerRetirada] = useState(false);
  const [showDatePickerEntrega, setShowDatePickerEntrega] = useState(false);

  const [dataRetirada, setDataRetirada] = useState<Date | null>(
    new Date(
      carga.dataRetiradaPretendida ? carga.dataRetiradaPretendida : new Date()
    )
  );
  const [dataEntrega, setDataEntrega] = useState<Date | null>(
    new Date(
      carga.dataEntregaPretendida ? carga.dataEntregaPretendida : new Date()
    )
  );
  const [valor, setValor] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [usuarioResponsavel] = useState({ id: "" });

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [formSubmetido, setFormSubmetido] = useState(false);

  const errors = {
    valor: obrigatorio(valor) || min(valor, 0),
    justificativa: max(justificativa, 120),
    usuarioResponsavel: obrigatorio(usuarioResponsavel),
  };

  const formPreenchido =
    dataRetirada != null && dataEntrega != null && valor !== "";
  const formValido = !errors.valor && !errors.justificativa;

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function abrirNegociacao() {
    setLoading(true);
    await api
      .post(`cargas/${carga.id}/negociacoes`, {
        veiculoId,
        proposta: {
          dataRetirada,
          dataEntrega,
          valor,
          justificativa,
          usuarioResponsavel: {
            id: usuarioLogado?.id,
          },
        },
      })
      .then((response) => {
        const responseCarga = response.data;
        navigate("DetalhesCarga", { carga: responseCarga, usuarioLogado });
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      });
    setLoading(false);
  }

  async function adicionarContraproposta() {
    setLoading(true);
    await api
      .post(`cargas/${carga.id}/negociacoes/${negociacaoId}/propostas`, {
        dataRetirada,
        dataEntrega,
        valor,
        justificativa,
        usuarioResponsavel: {
          id: usuarioLogado?.id,
        },
      })
      .then((response) => {
        const negociacao = response.data;
        navigate("DetalhesNegociacao", {
          negociacao,
          tipoCarga: negociacao.tipoCarga,
          usuarioLogado,
        });
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
    if (novaNegociacao) {
      abrirNegociacao();
    } else {
      adicionarContraproposta();
    }
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Proposta" />
      <ScrollView style={styles.scrollCampos}>
        <Text style={styles.label}>Data de retirada: *</Text>
        <TextInput
          style={styles.input}
          value={
            dataRetirada
              ? format(new Date(dataRetirada.toString()), "dd/MM/yyyy")
              : ""
          }
          placeholder="Data para a carga ser retirada"
          onTouchEnd={() => setShowDatePickerRetirada(true)}
          editable={carga.negociaDatas}
        />

        {showDatePickerRetirada && (
          <DateTimePicker
            value={dataRetirada || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePickerRetirada(false);
              if (event.type === "set") {
                if (date) {
                  if (dataEntrega && dataRetirada && dataEntrega < date) {
                    const diferenca =
                      dataEntrega.getTime() - dataRetirada.getTime();
                    setDataEntrega(new Date(date.getTime() + diferenca));
                  }
                  setDataRetirada(date);
                }
              }
            }}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Data de entrega: *</Text>
        <TextInput
          style={styles.input}
          value={
            dataEntrega
              ? format(new Date(dataEntrega.toString()), "dd/MM/yyyy")
              : ""
          }
          placeholder="Data para a carga ser entregue"
          onTouchEnd={() => setShowDatePickerEntrega(true)}
          editable={carga.negociaDatas}
        />

        {showDatePickerEntrega && (
          <DateTimePicker
            value={dataEntrega || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePickerEntrega(false);
              if (event.type === "set") {
                setDataEntrega(date || new Date());
              }
            }}
            minimumDate={dataRetirada || new Date()}
          />
        )}

        <Text style={styles.label}>
          Valor: *
          {formSubmetido && errors.valor && (
            <Text style={styles.textoValidacao}>{`\b${errors.valor}`}</Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.valor ? styles.inputError : null,
          ]}
          value={valor}
          onChangeText={(text) => setValor(text)}
          placeholder="Valor do frete"
          keyboardType="numeric"
        />

        <Text style={styles.label}>
          Justificativa:
          {formSubmetido && errors.justificativa && (
            <Text style={styles.textoValidacao}>
              {`\b${errors.justificativa}`}
            </Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.justificativa ? styles.inputError : null,
          ]}
          value={justificativa}
          onChangeText={(text) => setJustificativa(text)}
          placeholder="Justificativa para o valor"
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
}

export default CadastroProposta;
