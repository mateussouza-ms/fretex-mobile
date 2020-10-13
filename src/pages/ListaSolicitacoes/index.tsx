import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, FlatList } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';
import { Icon, ListItem } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';

function ListaSolicitacoes() {
    const [cargas, setCargas] = useState([
        {
            id: '',
            clienteId: '',
            tipoCarga: '',
            peso: '',
            enderecoRetirada: {
                cep: '',
                logradouro: '',
                numero: '',
                bairro: '',
                complemento: '',
                cidade: {
                    id: '',
                    nome: '',
                    uf: {
                        sigla: '',
                        nome: '',
                    }
                }
            },
            enderecoEntrega: {
                cep: '',
                logradouro: '',
                numero: '',
                bairro: '',
                complemento: '',
                cidade: {
                    id: '',
                    nome: '',
                    uf: {
                        sigla: '',
                        nome: '',
                    }
                }
            },
            observacoes: '',
            dataCadastro: '',
            dataRetirada: '',
            dataEntrega: '',
            negociacoes: [],
        },

    ]);

    const [filtroSituacao, setSituacaoFiltro] = useState('');

    useEffect(() => {
        handleFilterSubmit('cadastradas')

    }, []);


    async function handleFilterSubmit(situacao: string) {

        setSituacaoFiltro(situacao);

        await api.get('cargas', {
            params: {
                situacao,
            }
        }).then(response => {
            setCargas(response.data);
        });


    }



    return (
        <View style={styles.container}>
            <PageHeader title="Lista de solicitações" />

            <View style={styles.filterGroup}>
                <Text style={styles.label}>Situação da carga: </Text>
                <View style={styles.selectContainer}>
                    <Picker
                        selectedValue={filtroSituacao}
                        onValueChange={(itemValue) => handleFilterSubmit(itemValue.toString())}
                        mode="dropdown"
                    >
                        <Picker.Item value="cadastradas" label={'Cadastradas'} />
                        <Picker.Item value="em-negociacao" label={'Em negociação'} />
                        <Picker.Item value="aguardando-retirada" label={'Aguardando retirada'} />
                        <Picker.Item value="em-transporte" label={'Em transporte'} />
                        <Picker.Item value="finalizadas" label={'Finalizadas'} />
                    </Picker>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>

                <View style={styles.list}>
                    {cargas.map((carga) => (
                        <ListItem key={carga.id} onPress={() => { }} bottomDivider>
                            <ListItem.Content>
                                <ListItem.Title>{carga.tipoCarga + ' (' + carga.peso + ' kg)'}</ListItem.Title>
                                <ListItem.Subtitle>
                                    {
                                        carga.enderecoRetirada.cidade.nome
                                        + '-'
                                        + carga.enderecoRetirada.cidade.uf.sigla
                                        + ' -> '
                                        + carga.enderecoEntrega.cidade.nome
                                        + '-'
                                        + carga.enderecoEntrega.cidade.uf.sigla
                                    }
                                </ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron color='grey' />
                        </ListItem>
                    ))}
                </View>
            </ScrollView>
        </View>

    );
}

export default ListaSolicitacoes;