import React, { useState } from "react";
import { View, ScrollView, Text, Alert, RefreshControl } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { ListItem, Overlay } from "react-native-elements";
import { format } from "date-fns";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import styles from "./styles";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/auth";

function DetalhesNegociacao({ route }: any) {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const { usuarioLogado } = useAuth();

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [carga, setCarga] = useState({
    id: "",
    clienteId: "",
    tipoCarga: "",
    peso: "",
    enderecoRetirada: {
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      complemento: "",
      cidade: {
        id: "",
        nome: "",
        uf: {
          sigla: "",
          nome: "",
        },
      },
    },
    enderecoEntrega: {
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      complemento: "",
      cidade: {
        id: "",
        nome: "",
        uf: {
          sigla: "",
          nome: "",
        },
      },
    },
    observacoes: "",
    dataCadastro: "",
    dataRetirada: "",
    dataEntrega: "",
    dataRetiradaPretendida: "",
    dataEntregaPretendida: "",
    negociaDatas: false,
    negociacoes: [
      {
        id: "",
        cargaId: "",
        veiculo: {
          id: "",
          prestadorServicoId: "",
          nome: "",
          pesoMaximo: "",
          outrasCaracteristicas: "",
        },
        status: "",
        finalizacaoNegociacao: "",
        propostas: [
          {
            id: "",
            valor: "",
            justificativa: "",
            aceita: "",
            usuarioResponsavel: {
              id: "",
              nome: "",
            },
            dataCriacao: "",
          },
        ],
      },
    ],
  });

  const [negociacao, setNegociacao] = useState<{
    id: string;
    cargaId: string;
    veiculo: {
      id: string;
      prestadorServicoId: string;
      nome: string;
      pesoMaximo: string;
      outrasCaracteristicas: string;
    };
    status: string;
    finalizacaoNegociacao: string;
    propostas: [
      {
        id: string;
        valor: number;
        justificativa: string;
        aceita: boolean;
        usuarioResponsavel: {
          id: number;
          nome: string;
        };
        dataCriacao: string;
        dataRetirada: Date;
        dataEntrega: Date;
      }
    ];
  }>();

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useFocusEffect(() => {
    setNegociacao(route.params.negociacao);
    setCarga(route.params.carga);
  });

  async function handleCancelarNegociacao() {
    setLoading(true);
    api
      .delete(`cargas/${negociacao?.cargaId}/negociacoes/${negociacao?.id}`)
      .then(() => {
        if (negociacao) {
          const neg = negociacao;
          neg.status = "FINALIZADA_SEM_ACORDO";
          setNegociacao(neg);
        }
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      })
      .finally(() => setLoading(false));
  }

  async function aceitarProposta(proposta: any) {
    setLoading(true);
    if (usuarioLogado?.perfilSelecionado?.perfil === "PRESTADOR_SERVICOS") {
      await api
        .post(
          `cargas/${negociacao?.cargaId}/negociacoes/${negociacao?.id}/propostas`,
          {
            valor: proposta.valor,
            justificativa: "PROPOSTA ACEITA PELO PRESTADOR",
            usuarioResponsavel: {
              id: usuarioLogado.id,
            },
            dataRetirada: proposta.dataRetirada,
            dataEntrega: proposta.dataEntrega,
          }
        )
        .then((response) => {
          navigate("DetalhesNegociacao", {
            negociacao: response.data.negociacao,
            carga,
            usuarioLogado,
          });
        })
        .catch((error) => {
          setErroApi(JSON.stringify(error.response.data));
          toggleOverlay();
        });
    } else {
      await api
        .patch(
          `cargas/${negociacao?.cargaId}/negociacoes/${negociacao?.id}/propostas/${proposta.id}`,
          {
            aceita: true,
            usuarioId: usuarioLogado?.id,
          }
        )
        .then((response) => {
          navigate("Pagamento", {
            finalizacaoNegociacao: response.data,
            cargaId: negociacao?.cargaId,
            negociacaoId: negociacao?.id,
          });
        })
        .catch((error) => {
          setErroApi(JSON.stringify(error.response.data));
          toggleOverlay();
        });
    }
    setLoading(false);
  }

  function contrapropor(propostaAnterior: any) {
    const novaCarga = carga;
    novaCarga.dataEntregaPretendida = propostaAnterior.dataEntrega;
    novaCarga.dataRetiradaPretendida = propostaAnterior.dataRetirada;

    navigate("CadastroProposta", {
      carga: novaCarga,
      negociacaoId: negociacao?.id,
      novaNegociacao: false,
      usuarioLogado,
      veiculoId: negociacao?.veiculo.id,
    });
  }

  function confirmarAceitacao(proposta: any) {
    Alert.alert(
      "Confirmação",
      `Realmente deseja aceitar a proposta com o valor de R$${proposta.valor
        .toFixed(2)
        .replace(".", ",")}?`,
      [
        {
          text: "NÃO",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "SIM",
          onPress: () => {
            aceitarProposta(proposta);
          },
        },
      ],
      { cancelable: true }
    );
  }

  function confirmarCancelamento() {
    Alert.alert(
      "Confirmação",
      "Realmente deseja cancelar a negociação?",
      [
        {
          text: "NÃO",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "SIM",
          onPress: () => {
            handleCancelarNegociacao();
          },
        },
      ],
      { cancelable: true }
    );
  }

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await api
      .get(`cargas/${negociacao?.cargaId}/negociacoes/${negociacao?.id}`)
      .then((response) => {
        navigate("DetalhesNegociacao", {
          negociacao: response.data,
          carga,
          usuarioLogado,
        });
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      });

    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Detalhes da negociação" />
      <View style={styles.detalhes}>
        <Text style={styles.label}>
          Carga:
          <Text style={[styles.label, styles.labelContent]}>
            {` ${carga.tipoCarga}`}
          </Text>
        </Text>

        <Text style={styles.label}>
          Veículo:
          <Text style={[styles.label, styles.labelContent]}>
            {` ${
              `${negociacao?.veiculo.nome} - ` +
              `${
                negociacao?.veiculo.outrasCaracteristicas &&
                negociacao?.veiculo.outrasCaracteristicas
              }` +
              `suporta até ${negociacao?.veiculo.pesoMaximo} Kg)`
            }`}
          </Text>
        </Text>

        <Text style={styles.label}>
          Situação:
          <Text style={[styles.label, styles.labelContent]}>
            {` ${
              negociacao?.status === "ABERTA"
                ? "EM NEGOCIAÇÃO"
                : negociacao?.status
            }`}
          </Text>
        </Text>
      </View>

      <Text style={[styles.label, styles.labelList]}>Propostas: </Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.list}>
          {negociacao?.propostas.map((proposta) => (
            <ListItem
              key={proposta.id}
              bottomDivider
              containerStyle={[
                styles.listItem,
                proposta.aceita === true
                  ? styles.listItemAceito
                  : proposta.aceita === false && styles.listItemNaoAceito,
              ]}
            >
              <ListItem.Content>
                <ListItem.Title>
                  {`${proposta.usuarioResponsavel.nome}, em ${
                    proposta.dataCriacao &&
                    format(
                      new Date(proposta.dataCriacao),
                      "dd/MM/yyyy 'às' HH:mm:ss"
                    )
                  }`}
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text style={styles.subtitle}>
                    Data para retirada:
                    {` ${format(
                      new Date(proposta.dataRetirada.toString()),
                      "dd/MM/yyyy"
                    )}\n`}
                    Data para entrega:
                    {` ${format(
                      new Date(proposta.dataEntrega.toString()),
                      "dd/MM/yyyy"
                    )}\n`}
                    Valor proposto: R$
                    {`${proposta.valor.toFixed(2).replace(".", ",")}\n`}
                    Justificativa: {`${proposta.justificativa}\n`}
                    Status:
                    {proposta.aceita === true && " ACEITA"}
                    {!proposta.aceita === false && " NÃO ACEITA"}
                    {proposta.aceita == null && " SEM RESPOSTA"}
                  </Text>
                </ListItem.Subtitle>
                <ListItem.ButtonGroup
                  buttons={["Aceitar", "Contrapropor"]}
                  onPress={(botaoIndex) => {
                    if (botaoIndex === 0) {
                      confirmarAceitacao(proposta);
                    } else {
                      contrapropor(proposta);
                    }
                  }}
                  containerStyle={styles.listButtonsContainer}
                  buttonStyle={[
                    styles.buttonList,
                    proposta.aceita === true
                      ? styles.listItemAceito
                      : proposta.aceita === false && styles.listItemNaoAceito,
                  ]}
                  textStyle={styles.buttonListText}
                  disabled={
                    proposta.aceita != null ||
                    proposta.usuarioResponsavel.id === usuarioLogado?.id ||
                    negociacao?.status !== "ABERTA"
                  }
                  disabledStyle={[
                    styles.buttonList,
                    proposta.aceita === true
                      ? styles.listItemAceito
                      : proposta.aceita === false && styles.listItemNaoAceito,
                  ]}
                />
              </ListItem.Content>
            </ListItem>
          ))}
          <RectButton
            enabled={negociacao?.status === "ABERTA"}
            style={[
              styles.button,
              negociacao?.status !== "ABERTA" ? styles.buttonDisabled : null,
            ]}
            onPress={confirmarCancelamento}
          >
            <Text style={styles.buttonText}>Cancelar negociação</Text>
          </RectButton>

          {usuarioLogado?.perfilSelecionado?.perfil === "PRESTADOR_SERVICOS" &&
            negociacao?.status === "FINALIZADA_COM_ACORDO" &&
            !carga.dataRetirada && (
              <RectButton
                enabled={negociacao?.status === "FINALIZADA_COM_ACORDO"}
                style={[styles.button, styles.buttonDatas]}
                onPress={() => navigate("InformacaoRetirada", { carga })}
              >
                <Text style={styles.buttonText}>Informar retirada</Text>
              </RectButton>
            )}

          {usuarioLogado?.perfilSelecionado?.perfil === "PRESTADOR_SERVICOS" &&
            negociacao?.status === "FINALIZADA_COM_ACORDO" &&
            !!carga.dataRetirada &&
            !carga.dataEntrega && (
              <RectButton
                enabled={negociacao?.status === "FINALIZADA_COM_ACORDO"}
                style={[styles.button, styles.buttonDatas]}
                onPress={() => navigate("InformacaoEntrega", { carga })}
              >
                <Text style={styles.buttonText}>Informar entrega</Text>
              </RectButton>
            )}
        </View>

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
      </ScrollView>
    </View>
  );
}

export default DetalhesNegociacao;
