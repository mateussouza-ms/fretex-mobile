import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';

import iconeCaminhao from '../../assets/images/icons/caminhao.png';
import iconeCliente from '../../assets/images/icons/cliente.png';
import { Overlay } from 'react-native-elements';
import { useAuth, UsuarioLogado } from '../../contexts/auth';



const SelecaoPerfil: React.FC = () => {
    const { usuarioLogado, alterarPerfil, adicionarPerfil } = useAuth();

    let primeiroNome = usuarioLogado?.nome.split(' ')[0]

    const { navigate } = useNavigation();

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);

    function handlePerfilCliente() {
        if (usuarioLogado?.perfis.indexOf('CLIENTE') == -1) {
            cadastrarCliente();
        } else {
            alterarPerfil('CLIENTE');
            navigate('Inicial');
        }
    }

    function handlePerfilPrestador() {
        if (usuarioLogado?.perfis.indexOf('PRESTADOR_SERVICOS') == -1) {
            navigate("CadastroVeiculo");
        } else {
            alterarPerfil('PRESTADOR_SERVICOS');
            navigate('Inicial');
        }
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    };


    async function cadastrarCliente() {
        await api.post(`usuarios/${usuarioLogado?.id}/perfil/cliente`)
            .then(() => {
                adicionarPerfil('CLIENTE');
                navigate('Inicial');
            })
            .catch((error) => {
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();
            });
    }

    return (
        <View style={styles.container}>
            <PageHeader title="Seleção de perfil" />

            <View style={styles.body}>

                {usuarioLogado?.perfis.length == 0 &&
                    <Text style={styles.title}>
                        Seja bem vindo(a), {`${primeiroNome}!\n`}
                        <Text style={styles.subtitle}>Seu cadastro foi realizado com sucesso.{'\n'}</Text>
                        <Text style={styles.titleBold}> Agora selecione um perfil:</Text>
                    </Text>
                }
                {usuarioLogado?.perfis.length != 0 &&
                    <Text style={[styles.title, styles.titleBold]}>Selecione o perfil:</Text>
                }
                <View style={styles.buttonsContainer}>
                    <View style={[styles.buttonContainer, usuarioLogado?.perfilSelecionado == 'CLIENTE' ? styles.selecionado : null]}>
                        <RectButton
                            onPress={handlePerfilCliente}
                            style={[styles.button, styles.buttonPrimary]}>
                            <Image source={iconeCliente} />

                            <Text style={styles.buttonText}>Cliente</Text>
                        </RectButton>
                    </View>

                    <View style={[styles.buttonContainer, usuarioLogado?.perfilSelecionado == 'PRESTADOR_SERVICOS' ? styles.selecionado : null]}>
                        <RectButton
                            onPress={handlePerfilPrestador}
                            style={[styles.button, styles.buttonSecondary]}>
                            <Image source={iconeCaminhao} />

                            <Text style={styles.buttonText}>Prestador de serviços</Text>
                        </RectButton>
                    </View>
                </View>
            </View>

            <Overlay overlayStyle={{ width: "90%" }} isVisible={visible} onBackdropPress={toggleOverlay}>
                <Text style={{ lineHeight: 20 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 17 }}>{`Erro ao consumir API: \n`}</Text>
                    <Text>{erroApi}</Text>
                </Text>
            </Overlay>
        </View>
    );
}

export default SelecaoPerfil;