import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';


import PageHeader from '../../components/PageHeader';

import styles from './styles';

import iconeSolicitarFrete from '../../assets/images/icons/solicitar-frete.png';
import iconeListaNegociacoes from '../../assets/images/icons/lista-negociacoes.png';


function Inicial() {
    const { navigate } = useNavigation();

    return (
        <View style={styles.container}>
            <PageHeader title="Página Inicial" />

            <View style={styles.body}>
                <View style={styles.buttonsContainer}>
                    <RectButton
                        onPress={() => {navigate('SolicitacaoFrete')}}
                        style={styles.button}>
                        <Image source={iconeSolicitarFrete} />

                        <Text style={styles.buttonText}>Solicitar frete</Text>
                    </RectButton>

                    <RectButton
                        onPress={() => {navigate('ListaSolicitacoes')}}
                        style={styles.button}>
                        <Image source={iconeListaNegociacoes} />

                        <Text style={styles.buttonText}>Acompanhar solicitações</Text>
                    </RectButton>
                </View>                
            </View>
        </View>
    );
}

export default Inicial;