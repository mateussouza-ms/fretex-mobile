import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, FlatList, Button } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';
import { Icon, ListItem } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { format } from 'date-fns';

function DetalhesNegociacao({ route, navigation }: any) {
    const [tipoCarga, setTipoCarga] = useState('');

    const [negociacao, setNegociacao] = useState(
        {
            id: '',
            cargaId: '',
            veiculo: {
                id: '',
                prestadorServicoId: '',
                nome: '',
                pesoMaximo: '',
                outrasCaracteristicas: ''
            },
            status: '',
            finalizacaoNegociacao: '',
            propostas: [
                {
                    id: '',
                    valor: 0.00,
                    justificativa: '',
                    aceita: '',
                    usuarioResponsavel: {
                        id: '',
                        nome: '',
                    },
                    dataCriacao: ''
                }
            ]
        }
    );

    useEffect(() => {
        const [negociacao, tipoCarga] = route.params;
        setNegociacao(negociacao);
        setTipoCarga(tipoCarga);
    }, []);

    return (
        <View style={styles.container}>
            
                <PageHeader title="Detalhes da negociação" />
                <View style={styles.detalhes}>
                    <Text style={styles.label}>Carga:
                    <Text style={[styles.label, styles.labelContent]}>
                            {' ' + tipoCarga}
                        </Text>
                    </Text>

                    <Text style={styles.label}>Veículo:
                    <Text style={[styles.label, styles.labelContent]}>
                            {' '
                                + negociacao.veiculo.nome + ' - '
                                + (negociacao.veiculo.outrasCaracteristicas && negociacao.veiculo.outrasCaracteristicas + ' (')
                                + 'suporta até ' + negociacao.veiculo.pesoMaximo + ' Kg)'
                            }
                        </Text>
                    </Text>
                </View>


                <Text style={[styles.label, styles.labelList]}>Propostas: </Text>
                <ScrollView style={styles.scrollView}>
                <View style={styles.list}>
                    {negociacao.propostas.map((proposta) => (
                        <ListItem
                            key={proposta.id}
                            onPress={() => { }}
                            bottomDivider
                            containerStyle={styles.listItem}
                        >
                            <ListItem.Content>
                                <ListItem.Title>
                                    {
                                        proposta.usuarioResponsavel.nome + ', em '
                                        + (proposta.dataCriacao && format(new Date(proposta.dataCriacao), "dd/MM/yyyy 'às' HH:mm:ss"))
                                    }
                                </ListItem.Title>
                                <ListItem.Subtitle>
                                    <Text style={styles.subtitle}>
                                        Valor proposto: R${proposta.valor.toFixed(2).replace('.', ',') + `\n`}
                                        Justificativa: {proposta.justificativa}
                                    </Text>
                                </ListItem.Subtitle>
                                <ListItem.ButtonGroup
                                    buttons={[
                                        'Aceitar', 'Contrapropor'
                                    ]}
                                    onPress={(botao) => { console.log(botao) }}
                                    containerStyle={styles.listButtonsContainer}
                                    buttonStyle={styles.buttonList}
                                    textStyle={styles.buttonListText}
                                >

                                </ListItem.ButtonGroup>

                            </ListItem.Content>
                        </ListItem>
                    ))}
                </View>
            </ScrollView>
        </View>

    );
}

export default DetalhesNegociacao;