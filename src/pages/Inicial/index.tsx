import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';


import PageHeader from '../../components/PageHeader';

import styles from './styles';

import iconeSolicitarFrete from '../../assets/images/icons/solicitar-frete.png';
import iconeListaNegociacoes from '../../assets/images/icons/lista-negociacoes.png';


function Inicial({ route }: any) {
    const { navigate } = useNavigation();
    const { usuarioLogado } = route.params;

    return (
        <View style={styles.container}>
            <PageHeader title="Página Inicial" />

            <View style={styles.body}>
                <View style={styles.buttonsContainer}>
                    {usuarioLogado.perfil == 'CLIENTE' &&
                        <RectButton
                            onPress={() => { navigate('SolicitacaoFrete', {usuarioLogado}) }}
                            style={styles.button}
                        >
                            <Image source={iconeSolicitarFrete} />
                            <Text style={styles.buttonText}>Solicitar frete</Text>
                        </RectButton>
                    }

                    <RectButton
                        onPress={() => { navigate('ListaSolicitacoes', {usuarioLogado}) }}
                        style={styles.button}>
                        <Image source={iconeListaNegociacoes} />

                        {usuarioLogado.perfil == 'CLIENTE' 
                        ? <Text style={styles.buttonText}>Listar solicitações de cargas</Text>
                        : <Text style={styles.buttonText}>Listar ofertas de cargas</Text>
                        }
                        </RectButton>
                </View>
            </View>
        </View>
    );
}

export default Inicial;