import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';


import PageHeader from '../../components/PageHeader';

import styles from './styles';

import iconeSolicitarFrete from '../../assets/images/icons/solicitar-frete.png';
import iconeListaNegociacoes from '../../assets/images/icons/lista-negociacoes.png';


function NegociacaoFinalizada() {
    const { navigate } = useNavigation();

    return (
        <View style={styles.container}>
            <PageHeader title="Negociacao finalizada" />

            <View style={styles.body}>


                <Text style={styles.title}>
                    Negociação finalizada! {'\n'}
                    <Text style={styles.subtitle}>Em breve o transportador irá pegar sua carga.</Text>
                </Text>
                
            </View >
            <View style={styles.linkContainer}>
                    <TouchableOpacity onPress={() => {navigate('Inicial')}}>
                        <Text style={styles.textLink}>Voltar para a página inicial</Text>
                    </TouchableOpacity>
                </View>
        </View >
    );
}

export default NegociacaoFinalizada;