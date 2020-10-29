import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Overlay } from 'react-native-elements';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import { max, obrigatorio, isEmail, min } from '../../valiadacao/validators';

import styles from './styles';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/auth';

function CadastroProposta({ route, navigation }: any) {
    const { usuarioLogado } = useAuth();
    const { cargaId, negociacaoId, novaNegociacao, veiculoId } = route.params;
    const { navigate } = useNavigation();

    const [loading, setLoading] = useState(false);

    const [valor, setValor] = useState('');
    const [justificativa, setJustificativa] = useState('');
    const [usuarioResponsavel, setUsuarioResponsavel] = useState({ id: '' });

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);
    const [formSubmetido, setFormSubmetido] = useState(false);


    const errors = {
        valor: obrigatorio(valor) || min(valor, 0),
        justificativa: obrigatorio(justificativa) || max(justificativa, 120),
        usuarioResponsavel: obrigatorio(usuarioResponsavel),
    };

    const formPreenchido = (valor != '' && justificativa != '');
    const formValido = (!errors.valor && !errors.justificativa);


    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function handleSubmit() {

        setFormSubmetido(true);

        if (!formValido) {
            return;
        }

        if (novaNegociacao) {
            abrirNegociacao();
        } else {
            adicionarContraproposta();
        }
    }

    async function abrirNegociacao() {
        setLoading(true);
        await api.post(
            `cargas/${cargaId}/negociacoes`,
            {
                veiculoId: veiculoId,
                proposta: {
                    valor,
                    justificativa,
                    usuarioResponsavel: {
                        id: usuarioLogado?.id
                    }
                }
            }
        ).then(response => {
            let carga = response.data;
            navigate('DetalhesCarga', { carga, usuarioLogado });
        }).catch(error => {
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();
        });
        setLoading(false);
    }

    async function adicionarContraproposta() {
        setLoading(true);
        await api.post(
            `cargas/${cargaId}/negociacoes/${negociacaoId}/propostas`,
            {
                valor,
                justificativa,
                usuarioResponsavel: {
                    id: usuarioLogado?.id,
                }
            }
        ).then(response => {
            let negociacao = response.data;
            console.log('negociacao: ' + JSON.stringify(negociacao));

            navigate('DetalhesNegociacao', { negociacao, tipoCarga: negociacao.tipoCarga, usuarioLogado });
        }).catch(error => {
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();
        });
        setLoading(false);
    }


    return (
        <View style={styles.container}>
            <PageHeader title="Proposta" />

            <ScrollView style={styles.scrollCampos}>
                <Text style={styles.label}>Valor:
                {formSubmetido
                        && errors.valor
                        && <Text style={styles.textoValidacao}>{`\b${errors.valor}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            formSubmetido && errors.valor ? styles.inputError : null
                        ]
                    }
                    value={valor}
                    onChangeText={(valor) => setValor(valor)}
                    placeholder="Valor do frete"
                    keyboardType="numeric"
                />


                <Text style={styles.label}>Justificativa:
                {formSubmetido
                        && errors.justificativa
                        && <Text style={styles.textoValidacao}>{`\b${errors.justificativa}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            formSubmetido && errors.justificativa ? styles.inputError : null
                        ]
                    }
                    value={justificativa}
                    onChangeText={(justificativa) => setJustificativa(justificativa)}
                    placeholder="Justificativa para o valor"
                />


                <RectButton
                    enabled={formPreenchido}
                    style={[styles.button, !formPreenchido ? styles.buttonDisabled : null]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>Salvar</Text>
                </RectButton>


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

export default CadastroProposta;