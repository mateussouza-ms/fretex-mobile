import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';

function CadastroVeiculo({ route, navigation }: any) {


    const { usuarioId, novoPrestador } = route.params;
    const { navigate } = useNavigation();
    const [nome, setNome] = useState('');
    const [pesoMaximo, setPesoMaximo] = useState('');
    const [outrasCaracteristicas, setOutrasCaracteristicas] = useState('');


    function handleSubmit() {
        console.log("handleSubmit")
        console.log("novoPrestador: " + novoPrestador)
        if (novoPrestador) {
            novoPrestadorServico();
        } else {
            adicionarVeiculo();
        }
    }

    async function novoPrestadorServico() {
        const response = await api.post(
            `usuarios/${usuarioId}/perfil/prestador-servico`,
            {
                veiculos: [
                    {
                        nome,
                        pesoMaximo,
                        outrasCaracteristicas
                    }
                ]
            }
        );
    }

    async function adicionarVeiculo() {
        const response = await api.post(
            `usuarios/${usuarioId}/perfil/prestador-servico/veiculos`,
            [
                {
                    nome,
                    pesoMaximo,
                    outrasCaracteristicas
                }
            ]
        );
    }


    return (
        <View style={styles.container}>
            <PageHeader title="Cadastro de veículo" />

            {novoPrestador && (<Text style={styles.title}>Para se cadastrar como prestador de serviços, informe abaixo os dados do seu veículo:</Text>)}
            <ScrollView style={styles.scrollCampos}>
                <Text style={styles.label}>Tipo de veículo:</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={(nome) => setNome(nome)}
                    placeholder="Ex: Caminhão baú, Camionete"
                />


                <Text style={styles.label}>Peso máximo de carga:</Text>
                <TextInput
                    style={styles.input}
                    value={pesoMaximo}
                    onChangeText={(pesoMaximo) => setPesoMaximo(pesoMaximo)}
                    placeholder="Peso máximo de carga (Kg)"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Outras características:</Text>
                <TextInput
                    style={styles.input}
                    value={outrasCaracteristicas}
                    onChangeText={(outrasCaracteristicas) => setOutrasCaracteristicas(outrasCaracteristicas)}
                    placeholder="Demais características do veículo"
                />

                <RectButton style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </RectButton>
            </ScrollView>
        </View>
    );
}

export default CadastroVeiculo;