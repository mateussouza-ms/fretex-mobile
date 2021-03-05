import React, { useState } from "react";
import { View, Text, TextInput, Image } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import { CheckBox, Overlay } from "react-native-elements";

import styles from "./styles";

import landingImg from "../../assets/images/logo-fretex.png";
import { useAuth } from "../../contexts/auth";
import Loader from "../../components/Loader";

function Login() {
  const { navigate } = useNavigation();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const [checked, setChecked] = useState(false);

  const [erroLogin, setErroLogin] = useState(false);

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function handleSubmit() {
    setLoading(true);
    signIn({ usuario, senha }, checked).catch((erro) => {
      const { error } = JSON.parse(erro.message);
      if (error === "invalid_grant") {
        setErroLogin(true);
      } else {
        setErroApi(
          "Ocorreu um erro inesperado. Favor entrar em contato com o suporte do sistema."
        );
        toggleOverlay();
      }
    });

    setLoading(false);
  }

  function handleNavigateToCadastroUsuarioPage() {
    navigate("CadastroUsuario");
  }

  function handleNavigateToRecuperarSenhaPage() {
    navigate("RecuperacaoSenha");
  }

  return (
    <View style={styles.container}>
      <Image source={landingImg} style={styles.banner} />

      <Text style={styles.title}>Fazer login</Text>
      <Text style={styles.textoErro}>
        {erroLogin && "Usuário ou senha inválidos!"}
      </Text>

      <TextInput
        style={styles.input}
        value={usuario}
        onChangeText={(text) => setUsuario(text)}
        placeholder="E-mail ou CPF/CNPJ"
        keyboardType={
          usuario.length > 1 && Number.isNaN(parseFloat(usuario))
            ? "email-address"
            : "visible-password"
        }
      />

      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={(text) => setSenha(text)}
        placeholder="Senha"
        secureTextEntry
      />

      <CheckBox
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
        checkedColor="#fff"
        title="Lembrar-me"
        checked={checked}
        onPress={() => setChecked(!checked)}
      />
      <RectButton style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Entrar</Text>
      </RectButton>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleNavigateToCadastroUsuarioPage}>
          <Text style={styles.textLink}>Criar uma conta</Text>
        </TouchableOpacity>
        <Text style={styles.textLink}> | </Text>
        <TouchableOpacity onPress={handleNavigateToRecuperarSenhaPage}>
          <Text style={styles.textLink}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versaoContainer}>
        <Text style={styles.versaoTexto}>Fretex v1.0</Text>
      </View>

      <Loader loading={loading} />

      <Overlay
        overlayStyle={{ width: "90%" }}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <Text style={{ lineHeight: 20 }}>
          <Text>{erroApi}</Text>
        </Text>
      </Overlay>
    </View>
  );
}

export default Login;
