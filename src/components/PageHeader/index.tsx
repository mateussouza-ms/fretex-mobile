import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  Modal,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";

import { useAuth } from "../../contexts/auth";

import logoImg from "../../assets/images/logo-fretex-icone-lado.png";
import AvatarImage from "../../assets/images/icons/user-avatar.png";

import styles from "./styles";

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }: PageHeaderProps) => {
  const { navigate } = useNavigation();
  const { signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const { usuarioLogado } = useAuth();

  function handleSair() {
    Alert.alert(
      "Confirmação",
      "Realmente deseja sair?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "SIM",
          onPress: () => {
            signOut();
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              {" "}
              x{" "}
            </Text>

            <Text style={styles.modalText}>{usuarioLogado?.nome}</Text>
            <Text>{usuarioLogado?.email}</Text>

            <View style={styles.modalButtonsGroup}>
              <TouchableHighlight
                style={styles.modalButton}
                onPress={() => {
                  navigate("AlteracaoSenha");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Alterar senha</Text>
              </TouchableHighlight>

              {usuarioLogado?.perfilSelecionado?.perfil ===
                "PRESTADOR_SERVICOS" && (
                <TouchableHighlight
                  style={styles.modalButton}
                  onPress={() => {
                    navigate("CadastroVeiculo");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Adicionar veículo</Text>
                </TouchableHighlight>
              )}

              <TouchableHighlight
                style={styles.modalButton}
                onPress={() => {
                  navigate("AtualizacaoCadastro");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Atualizar cadastro</Text>
              </TouchableHighlight>
            </View>

            <TouchableOpacity style={styles.link} onPress={handleSair}>
              <Text style={styles.textoLink}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.topbar}>
        {/* <BorderlessButton onPress={handleGoBack}>
                    <Image source={backIcon} resizeMode="contain" />
                </BorderlessButton> */}

        <Image style={styles.logo} source={logoImg} resizeMode="contain" />
        {usuarioLogado && (
          <Avatar
            containerStyle={[
              styles.avatar,
              usuarioLogado?.perfilSelecionado?.perfil === "CLIENTE" &&
                styles.avatarCliente,
              usuarioLogado?.perfilSelecionado?.perfil ===
                "PRESTADOR_SERVICOS" && styles.avatarPrestador,
            ]}
            // avatarStyle= {{borderWidth: 5, borderColor: '#9871F5'}}

            onPress={() => setModalVisible(true)}
            rounded
            source={AvatarImage}
          />
        )}
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default PageHeader;
