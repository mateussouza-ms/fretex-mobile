import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, FlatList, Button, Alert, RefreshControl } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';
import { Icon, ListItem, Overlay } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { format } from 'date-fns';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CadastroProposta from '../CadastroProposta';
import { number } from 'yup';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/auth';

function DetalhesNegociacao({ route, navigation }: any) {
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(false);

    const { usuarioLogado } = useAuth();

    const [tipoCarga, setTipoCarga] = useState('');

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);

    const [negociacao, setNegociacao] = useState<{
        id: string,
        cargaId: string,
        veiculo: {
            id: string,
            prestadorServicoId: string,
            nome: string,
            pesoMaximo: string,
            outrasCaracteristicas: string
        },
        status: string,
        finalizacaoNegociacao: string,
        propostas: [
            {
                id: string,
                valor: number,
                justificativa: string,
                aceita: boolean,
                usuarioResponsavel: {
                    id: number,
                    nome: string,
                },
                dataCriacao: string
            }
        ]
    }
    >();

    useFocusEffect(() => {
        const { negociacao, tipoCarga } = route.params;
        setNegociacao(negociacao);
        setTipoCarga(tipoCarga);
    });

    function confirmarAceitacao(proposta: any) {
        Alert.alert(
            "Confirmação",
            "Realmente deseja aceitar a proposta com o valor de R$" + proposta.valor.toFixed(2).replace('.', ',') + '?',
            [
                {
                    text: "NÃO",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "SIM",
                    onPress: () => { aceitarProposta(proposta) }
                }
            ],
            { cancelable: true }
        );

    }



    async function aceitarProposta(proposta: any) {

        setLoading(true);
        if (usuarioLogado?.perfilSelecionado == 'PRESTADOR_SERVICOS') {
            await api.post(
                `cargas/${negociacao?.cargaId}/negociacoes/${negociacao?.id}/propostas`,
                {
                    valor: proposta.valor,
                    justificativa: 'PROPOSTA ACEITA PELO PRESTADOR',
                    usuarioResponsavel: {
                        id: usuarioLogado.id,
                    }
                }
            ).then(response => {
                let negociacao = response.data;
                navigate('DetalhesNegociacao', { negociacao, tipoCarga: negociacao.tipoCarga, usuarioLogado });
            }).catch(error => {
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();
            });
        } else {
            await api.patch(
                `cargas/${negociacao?.cargaId}/negociacoes/${negociacao?.id}/propostas/${proposta.id}`,
                {
                    aceita: true,
                    usuarioId: usuarioLogado?.id
                }
            ).then(response => {
                navigate('Pagamento', { finalizacaoNegociacao: response.data, cargaId: negociacao?.cargaId, negociacaoId: negociacao?.id })
            }).catch(error => {
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();
            });
        }
        setLoading(false);
    }

    function contrapropor() {
        navigate('CadastroProposta', { cargaId: negociacao?.cargaId, negociacaoId: negociacao?.id, novaNegociacao: false, usuarioLogado, veiculoId: negociacao?.veiculo.id })
    }

    function confirmarCancelamento() {
        Alert.alert(
            "Confirmação",
            "Realmente deseja cancelar a negociação?",
            [
                {
                    text: "NÃO",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "SIM",
                    onPress: () => { handleCancelarNegociacao }
                }
            ],
            { cancelable: true }
        );

    }

    async function handleCancelarNegociacao() {
        setLoading(true);
        api.delete(`cargas/${negociacao?.cargaId}/negociacoes/${negociacao?.id}`)
            .catch(error => {
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();
            });
        setLoading(false);
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const [refreshing, setRefreshing] = useState(false);

    async function onRefresh() {

        setRefreshing(true);

        await api.get(`cargas/${negociacao?.cargaId}/negociacoes/${negociacao?.id}`)
            .then(response => {
                let negociacao = response.data;
                navigate('DetalhesNegociacao', { negociacao, tipoCarga: negociacao.tipoCarga, usuarioLogado });
            }).catch(error => {
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();
            });

        setRefreshing(false)
    }

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
                            + negociacao?.veiculo.nome + ' - '
                            + (negociacao?.veiculo.outrasCaracteristicas && negociacao?.veiculo.outrasCaracteristicas + ' (')
                            + 'suporta até ' + negociacao?.veiculo.pesoMaximo + ' Kg)'
                        }
                    </Text>
                </Text>

                <Text style={styles.label}>Situação:
                <Text style={[styles.label, styles.labelContent]}>
                        {' ' + (negociacao?.status == 'ABERTA' ? 'EM NEGOCIAÇÃO' : negociacao?.status)}
                    </Text>
                </Text>
            </View>


            <Text style={[styles.label, styles.labelList]}>Propostas: </Text>
            <ScrollView
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.list}>
                    {negociacao?.propostas.map((proposta) => (
                        <ListItem
                            key={proposta.id}
                            bottomDivider
                            containerStyle={[styles.listItem, proposta.aceita == true ? styles.listItemAceito : proposta.aceita == false && styles.listItemNaoAceito]}
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
                                        Justificativa: {proposta.justificativa + `\n`}
                                        Status: {proposta.aceita == true ? 'ACEITA' : proposta.aceita == false ? 'NÃO ACEITA' : 'SEM RESPOSTA'}
                                    </Text>
                                </ListItem.Subtitle>
                                <ListItem.ButtonGroup
                                    buttons={[
                                        'Aceitar', 'Contrapropor'
                                    ]}
                                    onPress={(botaoIndex) => {
                                        botaoIndex == 0 ? confirmarAceitacao(proposta) : contrapropor()
                                    }}
                                    containerStyle={styles.listButtonsContainer}
                                    buttonStyle={[styles.buttonList, proposta.aceita == true ? styles.listItemAceito : proposta.aceita == false && styles.listItemNaoAceito]}
                                    textStyle={styles.buttonListText}
                                    disabled={
                                        proposta.aceita != null
                                        || proposta.usuarioResponsavel.id == usuarioLogado?.id
                                        || negociacao?.status != 'ABERTA'
                                    }
                                    disabledStyle={[styles.buttonList, proposta.aceita == true ? styles.listItemAceito : proposta.aceita == false && styles.listItemNaoAceito]}
                                >

                                </ListItem.ButtonGroup>

                            </ListItem.Content>
                        </ListItem>
                    ))}
                    <RectButton
                        enabled={negociacao?.status == 'ABERTA'}
                        style={[styles.button, negociacao?.status != 'ABERTA' ? styles.buttonDisabled : null]}
                        onPress={confirmarCancelamento}
                    >
                        <Text style={styles.buttonText}>Cancelar negociação</Text>
                    </RectButton>
                </View>

                <Loader loading={loading} />

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