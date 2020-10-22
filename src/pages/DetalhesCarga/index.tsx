import React, { useEffect, useState, version } from 'react';
import { View, ScrollView, Text, TextInput, FlatList, RefreshControl } from 'react-native';
import { BorderlessButton, RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';
import { Icon, ListItem, Overlay } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { format } from 'date-fns';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Loader from '../../components/Loader';

interface Veiculo {
    id: number,
    prestadorServicoId: number,
    nome: string,
    pesoMaximo: number,
    outrasCaracteristicas: string,
}

function DetalhesCarga({ route, navigation }: any) {
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(false);

    const { usuarioLogado } = route.params;
    const [veiculos, setVeiculos] = useState([]);
    const [veiculo, setVeiculo] = useState<Veiculo>();

    const [carga, setCarga] = useState(
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
            negociacoes: [
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
                            valor: '',
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
            ],
        },
    );

    useEffect(() => {
        setLoading(true);
        const { carga } = route.params;
        setCarga(carga);

        if (usuarioLogado.perfil == 'PRESTADOR_SERVICOS' && veiculos.length == 0) {
            api.get(`usuarios/${usuarioLogado.id}/perfil/prestador-servico`)
                .then(response => {
                    const { veiculos } = response.data;
                    setVeiculos(veiculos);
                    if (veiculos.length == 1) {
                        setVeiculo(veiculos[0]);
                    }
                });
        }
        setLoading(false);
    }, []);

    useFocusEffect(() => {
        const { carga } = route.params;
        setCarga(carga);
    });

    function handleChangeValueVeiculo(value: Veiculo) {
        if (value.id) {
            setVeiculo(value);
        }
    }

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };


    async function onRefresh() {

        setRefreshing(true);

        await api.get(`cargas/${carga.id}`)
            .then(response => {
                navigate('DetalhesCarga', { carga: response.data, usuarioLogado });
            }).catch(error => {
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();
            });

        setRefreshing(false)
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <PageHeader title="Detalhes da carga" />
                <View style={styles.detalhes}>
                    <Text style={styles.label}>Tipo de carga:
                    <Text style={[styles.label, styles.labelContent]}>
                            {' ' + carga.tipoCarga}
                        </Text>
                    </Text>

                    <Text style={styles.label}>Peso:
                    <Text style={[styles.label, styles.labelContent]}>
                            {' ' + carga.peso} Kg
                    </Text>
                    </Text>

                    <Text style={styles.label}>Observações:
                    <Text style={[styles.label, styles.labelContent]}>
                            {' ' + carga.observacoes}
                        </Text>
                    </Text>

                    <Text style={styles.label}>Endereço de partida:
                    <Text style={[styles.label, styles.labelContent]}>
                            {carga.enderecoRetirada && ' '
                                + carga.enderecoRetirada.logradouro + ', '
                                + carga.enderecoRetirada.numero + ', '
                                + carga.enderecoRetirada.complemento + ', '
                                + carga.enderecoRetirada.bairro + ', '
                                + carga.enderecoRetirada.cidade.nome + ' - '
                                + carga.enderecoRetirada.cidade.uf.sigla + ', '
                                + 'CEP: ' + carga.enderecoRetirada.cep

                            }
                        </Text>
                    </Text>

                    <Text style={styles.label}>Endereço de entrega:
                    <Text style={[styles.label, styles.labelContent]}>
                            {' '
                                + carga.enderecoEntrega.logradouro + ', '
                                + carga.enderecoEntrega.numero + ', '
                                + carga.enderecoEntrega.complemento + ', '
                                + carga.enderecoEntrega.bairro + ', '
                                + carga.enderecoEntrega.cidade.nome + ' - '
                                + carga.enderecoEntrega.cidade.uf.sigla + ', '
                                + 'CEP: ' + carga.enderecoEntrega.cep

                            }
                        </Text>
                    </Text>

                    <Text style={styles.label}>Data de cadastro:
                    <Text style={[styles.label, styles.labelContent]}>
                            {carga.dataCadastro && ' ' + format(new Date(carga.dataCadastro), "dd/MM/yyyy HH:mm:ss")}
                        </Text>
                    </Text>

                    <Text style={styles.label}>Data de retirada:
                    <Text style={[styles.label, styles.labelContent]}>
                            {carga.dataRetirada ? ' ' + format(new Date(carga.dataRetirada), "dd/MM/yyyy HH:mm:ss") : ' Sem registro'}
                        </Text>
                    </Text>
                    <Text style={styles.label}>Data de entrega:
                    <Text style={[styles.label, styles.labelContent]}>
                            {carga.dataEntrega ? ' ' + format(new Date(carga.dataEntrega), "dd/MM/yyyy HH:mm:ss") : ' Sem registro'}
                        </Text>
                    </Text>
                </View>


                <Text style={[styles.label, styles.labelList]}>Negociações: </Text>
                <View style={styles.list}>
                    {carga.negociacoes.map((negociacao) => (
                        <ListItem
                            key={negociacao.id}
                            onPress={() => {
                                navigate('DetalhesNegociacao', { negociacao, tipoCarga: carga.tipoCarga, usuarioLogado });
                            }}
                            bottomDivider
                        >
                            <ListItem.Content>
                                <ListItem.Title>Veículo: {negociacao.veiculo.nome}</ListItem.Title>
                                <ListItem.Subtitle>
                                    Status: {negociacao.status}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron color='grey' />
                        </ListItem>
                    ))}
                </View>
                {carga.negociacoes.length == 0 &&
                    <Text style={styles.textoNegociacoes}>
                        Ainda não existe nehuma negociação iniciada para esta carga.
                    </Text>
                }

                {usuarioLogado.perfil == 'PRESTADOR_SERVICOS' && carga.negociacoes.length == 0 && veiculos.length > 1 &&
                    <View style={styles.filterGroup}>
                        <Text style={styles.labelSelect}>Veículo selecionado:</Text>
                        <View style={styles.selectContainer}>
                            <Picker
                                selectedValue={JSON.stringify(veiculo)}
                                onValueChange={(value) => handleChangeValueVeiculo(JSON.parse(value.toString() || '{}'))}
                            >
                                {veiculos.map((veiculo: Veiculo) =>
                                    <Picker.Item key={veiculo.id} label={veiculo.nome} value={JSON.stringify(veiculo)} />
                                )}

                            </Picker>
                        </View>
                    </View>
                }

                {usuarioLogado.perfil == 'PRESTADOR_SERVICOS' && carga.negociacoes.length == 0 &&
                    <TouchableOpacity
                        style={styles.link}
                        onPress={() => navigate('CadastroProposta', { cargaId: carga.id, novaNegociacao: true, usuarioLogado, veiculoId: veiculo?.id })}
                    >
                        <Text style={styles.textPlus}>+ </Text>
                        <Text style={styles.textoLink}>Fazer uma proposta</Text>
                    </TouchableOpacity>
                }
            </ScrollView>

            <Loader loading={loading} />

            <Overlay overlayStyle={{ width: "90%" }} isVisible={visible} onBackdropPress={toggleOverlay}>
                <Text style={{ lineHeight: 20 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 17 }}>{`Erro ao consumir API: \n`}</Text>
                    <Text>{erroApi}</Text>
                </Text>
            </Overlay>
        </View>

    );
}

export default DetalhesCarga;