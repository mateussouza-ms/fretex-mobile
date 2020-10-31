import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';


import PageHeader from '../../components/PageHeader';

import styles from './styles';

import iconeSolicitarFrete from '../../assets/images/icons/solicitar-frete.png';
import iconeListaNegociacoes from '../../assets/images/icons/lista-negociacoes.png';
import { useAuth } from '../../contexts/auth';


const Inicial: React.FC = () => {
    const { navigate } = useNavigation();
    const { usuarioLogado } = useAuth();
    
    

    return (
        <View style={styles.container}>
            <PageHeader title="Página Inicial" />

            <View style={styles.body}>
                <View style={styles.buttonsContainer}>
                    {usuarioLogado?.perfilSelecionado == 'CLIENTE' &&
                        <RectButton
                            onPress={() => { navigate('SolicitacaoFrete') }}
                            style={styles.button}
                        >
                            <Image source={iconeSolicitarFrete} />
                            <Text style={styles.buttonText}>Solicitar frete</Text>
                        </RectButton>
                    }

                    <RectButton
                        onPress={() => { navigate('ListaSolicitacoes') }}
                        style={styles.button}>
                        <Image source={iconeListaNegociacoes} />

                        {usuarioLogado?.perfilSelecionado == 'CLIENTE' 
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