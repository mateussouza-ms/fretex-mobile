import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, FlatList, Button } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';
import { Icon, ListItem, Overlay } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import CadastroProposta from '../CadastroProposta';

function DetalhesNegociacao({ route, navigation }: any) {
    const { navigate } = useNavigation();
    const [tipoCarga, setTipoCarga] = useState('');

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);

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
                    aceita: false,
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

    function aceitarProposta(propostaId: string) {
        api.patch(
            `cargas/${negociacao.cargaId}/negociacoes/${negociacao.id}/propostas/${propostaId}`,
            {
                "aceita": true,
                "usuarioId": 1
            }
        ).then(response => {
            console.log(JSON.stringify(response.data));
        }).catch(error => {
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();
        });
    }

    function contrapropor(){
        navigate('CadastroProposta', {cargaId: negociacao.cargaId, negociacaoId: negociacao.id, novaNegociacao: false})
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    };

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
                                    onPress={(botaoIndex) => { 
                                       botaoIndex == 0 ? aceitarProposta(proposta.id) : contrapropor()
                                    }}
                                    containerStyle={styles.listButtonsContainer}
                                    buttonStyle={styles.buttonList}
                                    textStyle={styles.buttonListText}
                                    disabled= {proposta.aceita != null || proposta.usuarioResponsavel.id == '1'}
                                    disabledStyle={styles.buttonList}
                                >

                                </ListItem.ButtonGroup>

                            </ListItem.Content>
                        </ListItem>
                    ))}
                </View>
                <Overlay overlayStyle={{ width: "90%" }} isVisible={visible} onBackdropPress={toggleOverlay}>
                    <Text style={{ lineHeight: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 17 }}>{`Erro ao consumir API: \n`}</Text>
                        <Text>{erroApi}</Text>
                    </Text>
                </Overlay>
            </ScrollView>
        </View>

    );
}

export default DetalhesNegociacao;