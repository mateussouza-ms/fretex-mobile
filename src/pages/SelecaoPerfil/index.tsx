import React, { useEffect, useState } from "react";
import { View, Text, Image, Alert, BackHandler } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";

import { Overlay } from "react-native-elements";
import PageHeader from "../../components/PageHeader";

import api from "../../services/api";

import iconeCaminhao from "../../assets/images/icons/caminhao.png";
import iconeCliente from "../../assets/images/icons/cliente.png";
import { useAuth } from "../../contexts/auth";

import styles from "./styles";

function SelecaoPerfil() {
  const { usuarioLogado, alterarPerfil, adicionarPerfil } = useAuth();

  const primeiroNome = usuarioLogado?.nome.split(" ")[0];

  const { navigate } = useNavigation();

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          return false;
        }
        Alert.alert(
          "Confirmação",
          "Realmente deseja fechar o aplicativo?",
          [
            {
              text: "Cancelar",
              onPress: () => {
                return false;
              },
              style: "cancel",
            },
            {
              text: "SIM",
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
          { cancelable: true }
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function cadastrarCliente() {
    await api
      .post(`usuarios/${usuarioLogado?.id}/perfil/cliente`)
      .then((response) => {
        adicionarPerfil({ id: response.data.id, perfil: "CLIENTE" });
        navigate("Inicial");
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      });
  }

  function handlePerfilCliente() {
    let perfilCliente;
    usuarioLogado?.perfis.forEach((perfil) => {
      if (perfil.perfil === "CLIENTE") {
        perfilCliente = perfil;
      }
    });
    if (perfilCliente) {
      alterarPerfil(perfilCliente);
      navigate("Inicial");
    } else {
      cadastrarCliente();
    }
  }

  function handlePerfilPrestador() {
    let perfilPrestador;
    usuarioLogado?.perfis.forEach((perfil) => {
      if (perfil.perfil === "PRESTADOR_SERVICOS") {
        perfilPrestador = perfil;
      }
    });
    if (perfilPrestador) {
      alterarPerfil(perfilPrestador);
      navigate("Inicial");
    } else {
      navigate("CadastroVeiculo");
    }
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Seleção de perfil" />
      <View style={styles.body}>
        {usuarioLogado?.perfis.length === 0 && (
          <Text style={styles.title}>
            Seja bem vindo(a), {`${primeiroNome}!\n`}
            <Text style={styles.subtitle}>
              Seu cadastro foi realizado com sucesso.{"\n"}
            </Text>
            <Text style={styles.titleBold}> Agora selecione um perfil:</Text>
          </Text>
        )}
        {usuarioLogado?.perfis.length !== 0 && (
          <Text style={[styles.title, styles.titleBold]}>
            Selecione o perfil:
          </Text>
        )}
        <View style={styles.buttonsContainer}>
          <View
            style={[
              styles.buttonContainer,
              usuarioLogado?.perfilSelecionado?.perfil === "CLIENTE"
                ? styles.selecionado
                : null,
            ]}
          >
            <RectButton
              onPress={handlePerfilCliente}
              style={[styles.button, styles.buttonPrimary]}
            >
              <Image source={iconeCliente} />
              <Text style={styles.buttonText}>Cliente</Text>
            </RectButton>
          </View>

          <View
            style={[
              styles.buttonContainer,
              usuarioLogado?.perfilSelecionado?.perfil === "PRESTADOR_SERVICOS"
                ? styles.selecionado
                : null,
            ]}
          >
            <RectButton
              onPress={handlePerfilPrestador}
              style={[styles.button, styles.buttonSecondary]}
            >
              <Image source={iconeCaminhao} />
              <Text style={styles.buttonText}>Prestador de serviços</Text>
            </RectButton>
          </View>
        </View>
      </View>

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

export default SelecaoPerfil;
