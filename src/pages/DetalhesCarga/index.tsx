import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { ListItem, Overlay } from "react-native-elements";
import { Picker } from "@react-native-community/picker";
import { format } from "date-fns";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import styles from "./styles";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/auth";

interface Veiculo {
  id: number;
  prestadorServicoId: number;
  nome: string;
  pesoMaximo: number;
  outrasCaracteristicas: string;
}

function DetalhesCarga({ route }: any) {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const { usuarioLogado } = useAuth();
  const [veiculos, setVeiculos] = useState([]);
  const [veiculo, setVeiculo] = useState<Veiculo>();
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

  useEffect(() => {
    setLoading(true);
    setCarga(route.params.carga);

    if (
      usuarioLogado?.perfilSelecionado?.perfil === "PRESTADOR_SERVICOS" &&
      veiculos.length === 0
    ) {
      api
        .get(`usuarios/${usuarioLogado.id}/perfil/prestador-servico`)
        .then((response) => {
          const prestadorServico = response.data;
          setVeiculos(prestadorServico.veiculos);
        });
    }
    if (veiculos.length === 1) {
      setVeiculo(veiculos[0]);
    }
    setLoading(false);
  }, []);

  useFocusEffect(() => {
    setCarga(route.params.carga);
  });

  function handleChangeValueVeiculo(value: Veiculo) {
    if (value.id) {
      setVeiculo(value);
    }
  }

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function onRefresh() {
    setRefreshing(true);

    await api
      .get(`cargas/${carga.id}`)
      .then((response) => {
        navigate("DetalhesCarga", { carga: response.data, usuarioLogado });
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      });

    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <PageHeader title="Detalhes da carga" />
        <View style={styles.detalhes}>
          <Text style={styles.label}>
            Tipo de carga:
            <Text style={[styles.label, styles.labelContent]}>
              {` ${carga.tipoCarga}`}
            </Text>
          </Text>

          <Text style={styles.label}>
            Peso:
            <Text style={[styles.label, styles.labelContent]}>
              {` ${carga.peso} Kg`}
            </Text>
          </Text>

          <Text style={styles.label}>
            Observações:
            <Text style={[styles.label, styles.labelContent]}>
              {` ${carga.observacoes}`}
            </Text>
          </Text>

          <Text style={styles.label}>
            Endereço de partida:
            <Text style={[styles.label, styles.labelContent]}>
              {` ${
                (carga.enderecoRetirada?.logradouro
                  ? `${carga.enderecoRetirada?.logradouro}, `
                  : "") +
                (carga.enderecoRetirada?.numero
                  ? `${carga.enderecoRetirada.numero}, `
                  : "") +
                (carga.enderecoRetirada?.complemento
                  ? `${carga.enderecoRetirada.complemento}, `
                  : "") +
                (carga.enderecoRetirada?.bairro
                  ? `${carga.enderecoRetirada.bairro}, `
                  : "") +
                (carga.enderecoRetirada?.cidade.nome
                  ? `${carga.enderecoRetirada.cidade.nome}, `
                  : "") +
                (carga.enderecoRetirada?.cidade.uf.sigla
                  ? `${carga.enderecoRetirada.cidade.uf.sigla}, `
                  : "") +
                (carga.enderecoRetirada?.cep
                  ? `CEP: ${carga.enderecoRetirada.cep}`
                  : "")
              }`}
            </Text>
          </Text>

          <Text style={styles.label}>
            Endereço de entrega:
            <Text style={[styles.label, styles.labelContent]}>
              {` ${
                (carga.enderecoEntrega?.logradouro
                  ? `${carga.enderecoEntrega?.logradouro}, `
                  : "") +
                (carga.enderecoEntrega?.numero
                  ? `${carga.enderecoEntrega.numero}, `
                  : "") +
                (carga.enderecoEntrega?.complemento
                  ? `${carga.enderecoEntrega.complemento}, `
                  : "") +
                (carga.enderecoEntrega?.bairro
                  ? `${carga.enderecoEntrega.bairro}, `
                  : "") +
                (carga.enderecoEntrega?.cidade.nome
                  ? `${carga.enderecoEntrega.cidade.nome}, `
                  : "") +
                (carga.enderecoEntrega?.cidade.uf.sigla
                  ? `${carga.enderecoEntrega.cidade.uf.sigla}, `
                  : "") +
                (carga.enderecoEntrega?.cep
                  ? `CEP: ${carga.enderecoEntrega.cep}`
                  : "")
              }`}
            </Text>
          </Text>

          <Text style={styles.label}>
            Data de cadastro:
            <Text style={[styles.label, styles.labelContent]}>
              {carga.dataCadastro &&
                ` ${format(new Date(carga.dataCadastro), "dd/MM/yyyy HH:mm")}`}
            </Text>
          </Text>

          {!!carga.dataEntregaPretendida && !carga.dataRetirada && (
            <Text style={styles.label}>
              Data de retirada pretendida:
              <Text style={[styles.label, styles.labelContent]}>
                {` ${format(
                  new Date(carga.dataRetiradaPretendida),
                  "dd/MM/yyyy"
                )}`}
              </Text>
            </Text>
          )}

          {!!carga.dataEntregaPretendida && !carga.dataRetirada && (
            <Text style={styles.label}>
              Data de entrega pretendida:
              <Text style={[styles.label, styles.labelContent]}>
                {` ${format(
                  new Date(carga.dataEntregaPretendida),
                  "dd/MM/yyyy"
                )}`}
              </Text>
            </Text>
          )}

          {(!!carga.dataEntregaPretendida || !!carga.dataEntregaPretendida) &&
            !carga.dataRetirada && (
              <Text style={styles.label}>
                Aceita negociação de datas:
                <Text style={[styles.label, styles.labelContent]}>
                  {carga.negociaDatas ? " SIM" : " NÃO"}
                </Text>
              </Text>
            )}

          {!!carga.dataRetirada && (
            <Text style={styles.label}>
              Data de retirada:
              <Text style={[styles.label, styles.labelContent]}>
                {` ${format(new Date(carga.dataRetirada), "dd/MM/yyyy HH:mm")}`}
              </Text>
            </Text>
          )}

          {!!carga.dataEntrega && (
            <Text style={styles.label}>
              Data de entrega:
              <Text style={[styles.label, styles.labelContent]}>
                {` ${format(new Date(carga.dataEntrega), "dd/MM/yyyy HH:mm")}`}
              </Text>
            </Text>
          )}
        </View>

        <Text style={[styles.label, styles.labelList]}>Negociações: </Text>
        <View style={styles.list}>
          {carga.negociacoes.map((negociacao) => (
            <ListItem
              key={negociacao.id}
              onPress={() => {
                navigate("DetalhesNegociacao", {
                  negociacao,
                  carga,
                  usuarioLogado,
                });
              }}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>
                  Veículo: {negociacao.veiculo.nome}
                </ListItem.Title>
                <ListItem.Subtitle>
                  Status: {negociacao.status}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron color="grey" />
            </ListItem>
          ))}
        </View>

        {carga.negociacoes.length === 0 && (
          <Text style={styles.textoNegociacoes}>
            Ainda não existe nehuma negociação iniciada para esta carga.
          </Text>
        )}

        {usuarioLogado?.perfilSelecionado?.perfil === "PRESTADOR_SERVICOS" &&
          carga.negociacoes.length === 0 &&
          veiculos.length > 1 && (
            <View style={styles.filterGroup}>
              <Text style={styles.labelSelect}>Veículo selecionado:</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={JSON.stringify(veiculo)}
                  onValueChange={(value) =>
                    handleChangeValueVeiculo(
                      JSON.parse(value.toString() || "{}")
                    )
                  }
                >
                  {veiculos.map((veiculoMap: Veiculo) => (
                    <Picker.Item
                      key={veiculoMap.id}
                      label={veiculoMap.nome}
                      value={JSON.stringify(veiculoMap)}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

        {usuarioLogado?.perfilSelecionado?.perfil === "PRESTADOR_SERVICOS" &&
          carga.negociacoes.length === 0 && (
            <TouchableOpacity
              style={styles.link}
              onPress={() =>
                navigate("CadastroProposta", {
                  carga,
                  novaNegociacao: true,
                  usuarioLogado,
                  veiculoId: veiculo?.id,
                })
              }
            >
              <Text style={styles.textPlus}>+ </Text>
              <Text style={styles.textoLink}>Fazer uma proposta</Text>
            </TouchableOpacity>
          )}
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

export default DetalhesCarga;
