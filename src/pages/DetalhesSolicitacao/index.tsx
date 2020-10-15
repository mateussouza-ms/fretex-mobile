import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, FlatList } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';
import { Icon, ListItem } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

function DetalhesSolicitacao({ route, navigation }: any) {
    const { navigate } = useNavigation();

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
        setCarga(route.params);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <PageHeader title="Detalhes da solicitação" />
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
                            {carga.enderecoRetirada &&' '
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
            

            <Text style={[ styles.label, styles.labelList]}>Negociações: </Text>
                <View style={styles.list}>
                    {carga.negociacoes.map((negociacao) => (
                        <ListItem 
                            key={negociacao.id} 
                            onPress={() => {                                
                                navigate('DetalhesNegociacao', [negociacao, carga.tipoCarga]);
                            }}
                            bottomDivider
                        >
                            <ListItem.Content>
                                <ListItem.Title>{negociacao.status}</ListItem.Title>
                                <ListItem.Subtitle>

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

export default DetalhesSolicitacao;