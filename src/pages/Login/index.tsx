import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Image } from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Link, useNavigation } from '@react-navigation/native';

import { CheckBox, Overlay } from 'react-native-elements'

import styles from './styles';

import landingImg from '../../assets/images/logo-fretex.png';
import { useAuth } from '../../contexts/auth';
import Loader from '../../components/Loader';

function Login() {
    const { navigate } = useNavigation();

    const [email_cnp, setEmail_cnp] = useState('');
    const [senha, setSenha] = useState('');

    const [checked, setChecked] = useState(false);

    const [erroLogin, setErroLogin] = useState(false);

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    async function handleSubmit() {
        setLoading(true);
        signIn({ email_cnp, senha }, checked).catch(erro => {
            const { error } = JSON.parse(erro.message);
            if (error == 'invalid_grant') {
                setErroLogin(true);
            } else {
                setErroApi('Ocorreu um erro inesperado. Favor entrar em contato com o suporte do sistema.');
                toggleOverlay();
            }
        });
        
        setLoading(false);
    }

    function handleNavigateToCadastroUsuarioPage() {
        navigate("CadastroUsuario");
        //navigate('Inicial', { usuarioLogado: { id: 1, nome: '', perfil: 'CLIENTE' } });
    }

    function handleNavigateToRecuperarSenhaPage() {
        navigate('SelecaoPerfil', { usuarioId: 9, usuarioNome: "mateus" });
        //navigate('Inicial', { usuarioLogado: { id: 2, nome: '', perfil: 'PRESTADOR_SERVICOS' } });
    }


    return (
        <View style={styles.container}>


            <Image source={landingImg} style={styles.banner} />

            <Text style={styles.title}>Fazer login</Text>
            <Text style={styles.textoErro}> {erroLogin && 'Usuário ou senha inválidos!'}</Text>

            <TextInput
                style={styles.input}
                value={email_cnp}
                onChangeText={(email_cnp) => setEmail_cnp(email_cnp)}
                placeholder="E-mail ou CPF/CNPJ"
            />

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
            {/*
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                marginHorizontal: -10,
                marginTop: 15,
                marginBottom: -15,
                flex: 1,
                backgroundColor: '#8ef9fb38',
            }}>
                <RectButton
                    style={[
                        styles.button,
                        {
                            width: '45%',
                            margin: 5,
                            backgroundColor: '#9871F5',
                        }
                    ]}
                    onPress={() => navigate('Inicial', { usuarioLogado: { id: 1, nome: '', perfil: 'CLIENTE' } })}
                >
                    <Text style={styles.buttonText}>Cliente</Text>
                </RectButton>

                <RectButton
                    style={[
                        styles.button,
                        {
                            width: '45%',
                            margin: 5,
                            backgroundColor: '#04D361',
                        }
                    ]}
                    onPress={() => navigate('Inicial', { usuarioLogado: { id: 2, nome: '', perfil: 'PRESTADOR_SERVICOS' } })}
                >
                    <Text style={styles.buttonText}>Prestador</Text>
                </RectButton>
            </View>
*/}

            <Loader loading={loading} />
            
            <Overlay overlayStyle={{ width: "90%" }} isVisible={visible} onBackdropPress={toggleOverlay}>
                <Text style={{ lineHeight: 20 }}>

                    <Text>{erroApi}</Text>
                </Text>
            </Overlay>

        </View>
    );
}

export default Login;