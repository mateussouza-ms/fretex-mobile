import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { Overlay } from "react-native-elements";
import { Picker } from "@react-native-community/picker";
import { useNavigation } from "@react-navigation/native";
import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

import styles from "./styles";
import Loader from "../../components/Loader";

function Pagamento({ route }: any) {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const [formaPagamento, setFormaPagamento] = useState("");
  const [numeroParcelas, setNumeroParcelas] = useState(1);

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);

  const [cargaId, setCargaId] = useState("");
  const [negociacaoId, setNegociacaoId] = useState("");
  const [finalizacaoNegociacao, setFinalizacaoNegociacao] = useState({
    id: "",
    valorAcordado: 0.0,
    percentualTaxa: 0.0,
    valorTaxa: 0.0,
    valorTotal: 0.0,
    formasPagamento: [],
  });

  useEffect(() => {
    setFinalizacaoNegociacao(route.params.finalizacaoNegociacao);
    setCargaId(route.params.cargaId);
    setNegociacaoId(route.params.negociacaoId);
  }, []);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function handleSubmit() {
    setLoading(true);
    await api
      .post(`cargas/${cargaId}/negociacoes/${negociacaoId}/pagamentos`, {
        valorPago: finalizacaoNegociacao.valorTotal,
        formaPagamento,
        numeroParcelas,
      })
      .then(() => {
        navigate("NegociacaoFinalizada");
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      });
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Finalização de pagamento" />
      <View style={styles.titleContainer}>
        <Text style={styles.subtitle}>
          Confira os valores e escolha a forma de pagamento:
        </Text>
      </View>

      <View style={styles.detalhes}>
        <Text style={styles.label}>
          Valor acordado:
          <Text style={[styles.label, styles.labelContent]}>
            {` R$${finalizacaoNegociacao.valorAcordado.toFixed(2)}`}
          </Text>
        </Text>

        <Text style={styles.label}>
          Valor taxa:
          <Text style={[styles.label, styles.labelContent]}>
            {` R$${finalizacaoNegociacao.valorTaxa.toFixed(2)}`}
          </Text>
        </Text>

        <Text style={styles.label}>
          Valor total:
          <Text style={[styles.label, styles.labelContent]}>
            {` R$${finalizacaoNegociacao.valorTotal.toFixed(2)}`}
          </Text>
        </Text>

        <Text style={styles.label}>Selecione a forma de pagamento:</Text>
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={formaPagamento}
            onValueChange={(itemValue) =>
              setFormaPagamento(itemValue.toString())
            }
            mode="dropdown"
          >
            {finalizacaoNegociacao.formasPagamento.map(
              (formaPagamentoItemm) => (
                <Picker.Item
                  key={formaPagamentoItemm}
                  value={formaPagamentoItemm}
                  label={
                    (formaPagamentoItemm === "BOLETO" ? "Boleto" : "") +
                    (formaPagamentoItemm === "CARTAO_CREDITO"
                      ? "Cartão de crédito"
                      : "") +
                    (formaPagamentoItemm === "DEPOSITO_BANCARIO"
                      ? "Depósito bancário"
                      : "") +
                    (formaPagamentoItemm === "TRANSFERENCIA_BANCARIA"
                      ? "Transferência bancária"
                      : "")
                  }
                />
              )
            )}
          </Picker>
        </View>

        {formaPagamento === "CARTAO_CREDITO" && (
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={numeroParcelas}
              onValueChange={(itemValue) =>
                setNumeroParcelas(Number.parseInt(itemValue.toString(), 10))
              }
              mode="dropdown"
            >
              {[1, 2].map((index) => (
                <Picker.Item
                  key={index}
                  value={index}
                  label={`${index} x de R$${(
                    finalizacaoNegociacao.valorTotal / index
                  ).toFixed(2)}`}
                />
              ))}
            </Picker>
          </View>
        )}
      </View>
      <RectButton style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Confirmar pagamento</Text>
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

export default Pagamento;
