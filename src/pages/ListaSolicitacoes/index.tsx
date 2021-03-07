import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, RefreshControl } from "react-native";

import { ListItem, Overlay } from "react-native-elements";
import { Picker } from "@react-native-community/picker";
import { useNavigation } from "@react-navigation/native";
import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

import styles from "./styles";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/auth";

function ListaSolicitacoes() {
  const { navigate } = useNavigation();
  const { usuarioLogado } = useAuth();

  const [loading, setLoading] = useState(false);

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);

  const [cargas, setCargas] = useState([
    {
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
      negociacoes: [],
    },
  ]);

  const [situacaoFiltro, setSituacaoFiltro] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function handleFilterSubmit(situacao: string) {
    setLoading(true);
    setSituacaoFiltro(situacao);

    await api
      .get("cargas", {
        params: {
          situacao,
          usuarioId: usuarioLogado?.id,
          usuarioPerfil: usuarioLogado?.perfilSelecionado?.perfil,
        },
      })
      .then((response) => {
        setCargas(response.data);
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      })
      .finally(() => setLoading(false));
  }

  async function onRefresh() {
    setRefreshing(true);

    await handleFilterSubmit(situacaoFiltro);
    setRefreshing(false);
  }

  useEffect(() => {
    handleFilterSubmit("cadastradas");
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader
        title={
          usuarioLogado?.perfilSelecionado?.perfil === "CLIENTE"
            ? "Lista de solicitações"
            : "Lista de cargas"
        }
      />

      <View style={styles.filterGroup}>
        <Text style={styles.label}>Situação da carga: </Text>
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={situacaoFiltro}
            onValueChange={(itemValue) => {
              handleFilterSubmit(itemValue.toString());
            }}
            mode="dropdown"
          >
            <Picker.Item value="cadastradas" label="Cadastradas" />
            <Picker.Item value="em-negociacao" label="Em negociação" />
            <Picker.Item
              value="aguardando-retirada"
              label="Aguardando retirada"
            />
            <Picker.Item value="em-transporte" label="Em transporte" />
            <Picker.Item value="entregues" label="Entregues" />
            <Picker.Item
              value="finalizadas-sem-acordo"
              label="Finalizadas sem acordo"
            />
          </Picker>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.list}>
          {cargas.map((carga) => (
            <ListItem
              key={carga.id}
              onPress={() => {
                navigate("DetalhesCarga", { carga });
              }}
              containerStyle={styles.listItem}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>
                  {`${carga.tipoCarga} (${carga.peso} kg)`}
                </ListItem.Title>
                <ListItem.Subtitle>
                  {`${carga.enderecoRetirada.cidade.nome}-`}
                  {`${carga.enderecoRetirada.cidade.uf.sigla} -> `}
                  {`${carga.enderecoEntrega.cidade.nome}-`}
                  {`${carga.enderecoEntrega.cidade.uf.sigla}`}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron color="#000000" />
            </ListItem>
          ))}
        </View>
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

export default ListaSolicitacoes;
