import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Image } from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Link, useNavigation } from '@react-navigation/native';

import { CheckBox } from 'react-native-elements'

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';

import landingImg from '../../assets/images/logo-fretex.png';

function Login() {
    const { navigate } = useNavigation();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dddTelefone, setDddTelefone] = useState('');
    const [numeroTelefone, setNumeroTelefone] = useState('');
    const [senha, setSenha] = useState('');

    const [checked, setChecked] = useState(false);

    async function handleSubmit() {

    }

    function handleNavigateToCadastroUsuarioPage() {
        navigate("CadastroUsuario");
    }

    function handleNavigateToRecuperarSenhaPage() {
        navigate('SelecaoPerfil', {usuarioId: 9, usuarioNome: "mateus"});
    }


    return (
        <View style={styles.container}>

          
            <Image source={landingImg} style={styles.banner} />

            <Text style={styles.title}>Fazer login</Text>

            <Text style={styles.label}>E-mail:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(email) => setEmail(email)}
                placeholder="E-mail"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Senha:</Text>
            <TextInput
                style={styles.input}
                value={senha}
                onChangeText={(senha) => setSenha(senha)}
                placeholder="Senha"
                secureTextEntry={true}
            />

            <CheckBox
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}            
                checkedColor='#fff'
                title='Lembrar-me'
                checked={checked}
                onPress={() => setChecked(!checked)}
            />
            <RectButton style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Entrar</Text>
            </RectButton>

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={handleNavigateToCadastroUsuarioPage} >
                    <Text style={styles.textLink}>Criar uma conta</Text>
                </TouchableOpacity>
                <Text style={styles.textLink}> | </Text>
                <TouchableOpacity onPress={handleNavigateToRecuperarSenhaPage} >
                    <Text style={styles.textLink}>Esqueci minha senha</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

export default Login;