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

function CadastroVeiculo({ route, navigation }: any) {
    const { usuarioId, novoPrestador } = route.params;
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState('');
    const [pesoMaximo, setPesoMaximo] = useState('');
    const [outrasCaracteristicas, setOutrasCaracteristicas] = useState('');

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);
    const [formSubmetido, setFormSubmetido] = useState(false);


    const errors = {
        nome: obrigatorio(nome) || max(nome, 30),
        pesoMaximo: obrigatorio(pesoMaximo) || min(pesoMaximo, 0),
    };

    const formPreenchido = (nome != '' && pesoMaximo != '');
    const formValido = (!errors.nome && !errors.pesoMaximo);


    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function handleSubmit() {

        setFormSubmetido(true);

        if (!formValido) {
            return;
        }

        if (novoPrestador) {
            novoPrestadorServico();
        } else {
            adicionarVeiculo();
        }
    }

    async function novoPrestadorServico() {
        setLoading(true);
        await api.post(
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
        ).then(response => {
            let { id } = response.data;
            navigate('Inicial', { usuarioLogado: { id: usuarioId, nome: '', perfil: 'PRESTADOR_SERVICOS' } });
        }).catch(error => {
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();
        });
        setLoading(false);
    }

    async function adicionarVeiculo() {
        setLoading(true);
        await api.post(
            `usuarios/${usuarioId}/perfil/prestador-servico/veiculos`,
            [
                {
                    nome,
                    pesoMaximo,
                    outrasCaracteristicas
                }
            ]
        ).then(response => {
            console.log(response.data);
            let { id } = response.data;
            //navigate('SelecaoPerfil', { usuarioId: id, usuarioNome: nome });
        }).catch(error => {
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();
        });
        setLoading(false);
    }


    return (
        <View style={styles.container}>
            <PageHeader title="Cadastro de veículo" />

            {novoPrestador && (<Text style={styles.title}>Para se cadastrar como prestador de serviços, informe abaixo os dados do seu veículo:</Text>)}
            <ScrollView style={styles.scrollCampos}>
                <Text style={styles.label}>Tipo de veículo:
                {formSubmetido
                        && errors.nome
                        && <Text style={styles.textoValidacao}>{`\b${errors.nome}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            formSubmetido && errors.nome ? styles.inputError : null
                        ]
                    }
                    value={nome}
                    onChangeText={(nome) => setNome(nome)}
                    placeholder="Ex: Caminhão baú, Camionete"
                />


                <Text style={styles.label}>Peso máximo de carga:
                {formSubmetido
                        && errors.pesoMaximo
                        && <Text style={styles.textoValidacao}>{`\b${errors.pesoMaximo}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            formSubmetido && errors.pesoMaximo ? styles.inputError : null
                        ]
                    }
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

export default CadastroVeiculo;