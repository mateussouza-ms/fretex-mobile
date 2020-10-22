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
import Loader from '../../components/Loader';

function Pagamento({ route, navigation }: any) {
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(false);

    const [formaPagamento, setFormaPagamento] = useState('');
    const [numeroParcelas, setNumeroParcelas] = useState(1);

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);

    const [cargaId, setCargaId] = useState('');
    const [negociacaoId, setNegociacaoId] = useState('');
    const [finalizacaoNegociacao, setFinalizacaoNegociacao] = useState(
        {
            id: '',
            valorAcordado: 0.0,
            percentualTaxa: 0.0,
            valorTaxa: 0.0,
            valorTotal: 0.0,
            formasPagamento: []
        }
    );

    useEffect(() => {
        const { finalizacaoNegociacao, cargaId, negociacaoId } = route.params;
        setFinalizacaoNegociacao(finalizacaoNegociacao);
        setCargaId(cargaId);
        setNegociacaoId(negociacaoId);
    }, []);


    const toggleOverlay = () => {
        setVisible(!visible);
    };

    async function handleSubmit() {
        setLoading(true);
        await api.post(
            `cargas/${cargaId}/negociacoes/${negociacaoId}/pagamentos`,
            {
                valorPago: finalizacaoNegociacao.valorTotal,
                formaPagamento,
                numeroParcelas,
            }
        ).then(response => {
            console.log(JSON.stringify(response.data));
            navigate('NegociacaoFinalizada');
        }).catch(error => {
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();
        });
        setLoading(false);
    }

    return (
        <View style={styles.container}>

            <PageHeader title="Finalização de pagamento" />

            <View style={styles.titleContainer}>
                <Text style={styles.subtitle}>Confira os valores e escolha a forma de pagamento:</Text>
            </View>

            <View style={styles.detalhes}>
                <Text style={styles.label}>Valor acordado:
                    <Text style={[styles.label, styles.labelContent]}>
                        {' R$' + finalizacaoNegociacao.valorAcordado.toFixed(2)}
                    </Text>
                </Text>

                <Text style={styles.label}>Valor taxa:
                    <Text style={[styles.label, styles.labelContent]}>
                        {' R$'
                            + finalizacaoNegociacao.valorTaxa.toFixed(2)
                        }
                    </Text>
                </Text>

                <Text style={styles.label}>Valor total:
                    <Text style={[styles.label, styles.labelContent]}>
                        {' R$'
                            + finalizacaoNegociacao.valorTotal.toFixed(2)
                        }
                    </Text>
                </Text>



                <Text style={styles.label}>Selecione a forma de pagamento:</Text>
                <View style={styles.selectContainer}>
                    <Picker
                        selectedValue={formaPagamento}
                        onValueChange={(itemValue) => setFormaPagamento(itemValue.toString())}
                        mode="dropdown"
                    >
                        {finalizacaoNegociacao.formasPagamento.map(formaPagamento =>
                            <Picker.Item
                                key={formaPagamento}
                                value={formaPagamento}
                                label={
                                    formaPagamento == 'BOLETO'
                                        ? 'Boleto'
                                        : formaPagamento == 'CARTAO_CREDITO'
                                            ? 'Cartão de crédito'
                                            : formaPagamento == 'DEPOSITO_BANCARIO'
                                                ? 'Depósito bancário'
                                                : formaPagamento == 'TRANSFERENCIA_BANCARIA'
                                                    ? 'Transferência bancária'
                                                    : ''
                                }
                            />
                        )}
                    </Picker>
                </View>


                {formaPagamento == 'CARTAO_CREDITO' &&
                    <View style={styles.selectContainer}>
                        <Picker
                            selectedValue={numeroParcelas}
                            onValueChange={(itemValue) => setNumeroParcelas(Number.parseInt(itemValue.toString()))}
                            mode="dropdown"
                        >
                            {[1, 2,].map(index =>
                                <Picker.Item
                                    key={index}
                                    value={index}
                                    label={`${index} x de R$${(finalizacaoNegociacao.valorTotal / index).toFixed(2)}`}
                                />
                            )}
                        </Picker>
                    </View>
                }
            </View>
            <RectButton
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Confirmar pagamento</Text>
            </RectButton>

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

export default Pagamento;