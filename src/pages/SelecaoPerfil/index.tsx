import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';

import iconeCaminhao from '../../assets/images/icons/caminhao.png';
import iconeCliente from '../../assets/images/icons/cliente.png';



function SelecaoPerfil({ route, navigation }: any) {

    const { usuarioId, usuarioNome } = route.params;

    let primeiroNome = usuarioNome.split(' ')[0]

    const { navigate } = useNavigation();

    function handleNavigateToCadastroVeiculoPage() {
        console.log("handleNavigateToCadastroVeiculoPage");
        navigate("CadastroVeiculo", { usuarioId, novoPrestador: true })
    }


    async function cadastrarCliente() {
        const response = await api.post(`usuarios/${usuarioId}/perfil/cliente`);
    }

    return (
        <View style={styles.container}>
            <PageHeader title="Seleção de perfil" />

            <View style={styles.body}>

                <Text style={styles.title}>
                    Seja bem vindo(a), {`${primeiroNome}!\n`}
                    <Text style={styles.subtitle}>Seu cadastro foi realizado com sucesso.{'\n'}</Text>
                    <Text style={styles.titleBold}> Agora selecione um perfil:</Text>
                </Text>

                <View style={styles.buttonsContainer}>
                    <RectButton
                        onPress={cadastrarCliente}
                        style={[styles.button, styles.buttonPrimary]}>
                        <Image source={iconeCliente} />

                        <Text style={styles.buttonText}>Cliente</Text>
                    </RectButton>

                    <RectButton
                        onPress={handleNavigateToCadastroVeiculoPage}
                        style={[styles.button, styles.buttonSecondary]}>
                        <Image source={iconeCaminhao} />

                        <Text style={styles.buttonText}>Prestador de serviços</Text>
                    </RectButton>
                </View>
            </View>
        </View>
    );
}

export default SelecaoPerfil;