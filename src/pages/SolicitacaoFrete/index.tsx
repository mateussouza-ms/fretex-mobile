import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, Image } from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Overlay } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';

import PageHeader from '../../components/PageHeader';

import { max, obrigatorio, min } from '../../valiadacao/validators';

import iconeSetaCima from '../../assets/images/icons/icone-seta-cima.png';
import iconeSetaBaixo from '../../assets/images/icons/icone-seta-baixo.png';

import api from '../../services/api';

import styles from './styles';
import { useAuth } from '../../contexts/auth';

interface UF {
    sigla: string,
    nome: string,
}

interface Cidade {
    id: number,
    nome: string,
    uf: string,
}

function SolicitacaoFrete() {
    const { navigate } = useNavigation();
    const { usuarioLogado } = useAuth();

    const [tipoCarga, setTipoCarga] = useState('');
    const [peso, setPeso] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const [enderecoRetiradaCep, setEnderecoRetiradaCep] = useState('');
    const [enderecoRetiradaLogradouro, setEnderecoRetiradaLogradouro] = useState('');
    const [enderecoRetiradaNumero, setEnderecoRetiradaNumero] = useState('');
    const [enderecoRetiradaBairro, setEnderecoRetiradaBairro] = useState('');
    const [enderecoRetiradaComplemento, setEnderecoRetiradaComplemento] = useState('');
    const [enderecoRetiradaUf, setEnderecoRetiradaUf] = useState({});
    const [enderecoRetiradaCidade, setEnderecoRetiradaCidade] = useState({
        id: 0,
        nome: '',
        uf: '',
    });

    const [enderecoEntregaCep, setEnderecoEntregaCep] = useState('');
    const [enderecoEntregaLogradouro, setEnderecoEntregaLogradouro] = useState('');
    const [enderecoEntregaNumero, setEnderecoEntregaNumero] = useState('');
    const [enderecoEntregaBairro, setEnderecoEntregaBairro] = useState('');
    const [enderecoEntregaComplemento, setEnderecoEntregaComplemento] = useState('');
    const [enderecoEntregaUf, setEnderecoEntregaUf] = useState({});
    const [enderecoEntregaCidade, setEnderecoEntregaCidade] = useState({
        id: 0,
        nome: '',
        uf: '',
    });

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);
    const [formSubmetido, setFormSubmetido] = useState(false);
    const [isEnderecoRetiradaVisible, setIsEnderecoRetiradaVisible] = useState(false);
    const [isEnderecoEntregaVisible, setIsEnderecoEntregaVisible] = useState(false);
    const [estados, setEstados] = useState([]);
    const [cidadesEnderecoRetirada, setCidadesEnderecoRetirada] = useState([]);
    const [cidadesEnderecoEntrega, setCidadesEnderecoEntrega] = useState([]);


    const errors = {
        tipoCarga: obrigatorio(tipoCarga) || max(tipoCarga, 120),
        peso: obrigatorio(peso) || min(Number.parseFloat(peso), 0),
        observacoes: max(observacoes, 120),

        enderecoRetiradaCep: obrigatorio(enderecoRetiradaCep) || min(enderecoRetiradaCep, 8) || max(enderecoRetiradaCep, 8),
        enderecoRetiradaLogradouro: obrigatorio(enderecoRetiradaLogradouro) || max(enderecoRetiradaLogradouro, 120),
        enderecoRetiradaNumero: obrigatorio(enderecoRetiradaNumero) || max(enderecoRetiradaNumero, 20),
        enderecoRetiradaBairro: obrigatorio(enderecoRetiradaBairro) || max(enderecoRetiradaBairro, 50),
        enderecoRetiradaComplemento: max(enderecoRetiradaComplemento, 120),
        enderecoRetiradaUf: obrigatorio(enderecoRetiradaUf),
        enderecoRetiradaCidade: obrigatorio(enderecoRetiradaCidade),

        enderecoEntregaCep: obrigatorio(enderecoEntregaCep) || min(enderecoEntregaCep, 8) || max(enderecoEntregaCep, 8),
        enderecoEntregaLogradouro: obrigatorio(enderecoEntregaLogradouro) || max(enderecoEntregaLogradouro, 120),
        enderecoEntregaNumero: obrigatorio(enderecoEntregaNumero) || max(enderecoEntregaNumero, 20),
        enderecoEntregaBairro: obrigatorio(enderecoEntregaBairro) || max(enderecoEntregaBairro, 50),
        enderecoEntregaComplemento: max(enderecoEntregaComplemento, 120),
        enderecoEntregaUf: obrigatorio(enderecoEntregaUf),
        enderecoEntregaCidade: obrigatorio(enderecoEntregaCidade),

    };

    const formPreenchido = (
        tipoCarga != ''
        && peso != ''
        && enderecoRetiradaCep != ''
        && enderecoRetiradaLogradouro != ''
        && enderecoRetiradaNumero != ''
        && enderecoRetiradaBairro != ''
        && (Object.entries(enderecoRetiradaCidade).length > 0)
        && enderecoEntregaCep != ''
        && enderecoEntregaLogradouro != ''
        && enderecoEntregaNumero != ''
        && enderecoEntregaBairro != ''
        && (Object.entries(enderecoEntregaCidade).length > 0)
    );

    const formValido = (
        !errors.tipoCarga
        && !errors.peso
        && !errors.observacoes
        && !errors.enderecoRetiradaCep
        && !errors.enderecoRetiradaLogradouro
        && !errors.enderecoRetiradaNumero
        && !errors.enderecoRetiradaBairro
        && !errors.enderecoRetiradaComplemento
        && !errors.enderecoRetiradaCidade
        && !errors.enderecoEntregaCep
        && !errors.enderecoEntregaLogradouro
        && !errors.enderecoEntregaNumero
        && !errors.enderecoEntregaBairro
        && !errors.enderecoEntregaComplemento
        && !errors.enderecoEntregaCidade
    );

    useEffect(() => {
        if (Object.entries(estados).length == 0) {
            api.get('estados').then(response => {
                setEstados(response.data);
            });
        }
    }, []);

    function handleChangeValueEnderecoRetiradaUf(value: UF) {
        if (value.sigla) {
            setEnderecoRetiradaUf(value);

            api.get('cidades', {
                params: {
                    uf: value.sigla
                }
            }).then(response => {
                setCidadesEnderecoRetirada(response.data);
            });
        }
    }

    function handleChangeValueEnderecoEntregaUf(value: UF) {
        if (value.sigla) {
            setEnderecoEntregaUf(value);

            api.get('cidades', {
                params: {
                    uf: value.sigla
                }
            }).then(response => {
                setCidadesEnderecoEntrega(response.data);
            });
        }
    }

    function handleChangeValueEnderecoRetiradaCidade(value: Cidade) {
        if (value) {
            setEnderecoRetiradaCidade(value);
        }
    }
    function handleChangeValueEnderecoEntegaCidade(value: Cidade) {
        if (value) {
            setEnderecoEntregaCidade(value);
        }
    }

    function handleToggleEnderecoRetiradaVisible() {
        setIsEnderecoRetiradaVisible(!isEnderecoRetiradaVisible);
    }

    function handleToggleEnderecoEntregaVisible() {
        setIsEnderecoEntregaVisible(!isEnderecoEntregaVisible);
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    }

    async function handleSubmit() {

        setFormSubmetido(true);

        if (!formValido) {
            return;
        }

        await api
            .post('cargas', {
                cliente: {
                    id: 1
                },
                tipoCarga,
                peso,
                enderecoRetirada: {
                    cep: enderecoRetiradaCep,
                    logradouro: enderecoRetiradaLogradouro,
                    numero: enderecoRetiradaNumero,
                    bairro: enderecoRetiradaBairro,
                    complemento: enderecoRetiradaComplemento,
                    cidade: {
                        id: enderecoRetiradaCidade.id
                    }
                },
                enderecoEntrega: {
                    cep: enderecoEntregaCep,
                    logradouro: enderecoEntregaLogradouro,
                    numero: enderecoEntregaNumero,
                    bairro: enderecoEntregaBairro,
                    complemento: enderecoEntregaComplemento,
                    cidade: {
                        id: enderecoEntregaCidade.id
                    }
                },
                observacoes,
            })
            .then(response => {
                console.log(response.data);
                navigate('ListaSolicitacoes')
            }).catch(error => {
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();
            });
    }



    return (
        <View style={styles.container}>
            <PageHeader title="Solicitação de frete" />

            <ScrollView style={styles.scrollCampos}>

                <Text style={styles.label}>Carga a ser transportada:
                {formSubmetido
                        && errors.tipoCarga
                        && <Text style={styles.textoValidacao}>{`\b${errors.tipoCarga}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            formSubmetido && errors.tipoCarga ? styles.inputError : null
                        ]
                    }
                    value={tipoCarga}
                    onChangeText={(tipoCarga) => setTipoCarga(tipoCarga)}
                    placeholder="Tipo de carga. Ex: geladeira"
                    maxLength={50}
                />

                <Text style={styles.label}>Peso:
                {formSubmetido
                        && errors.peso
                        && <Text style={styles.textoValidacao}>{`\b${errors.peso}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            formSubmetido && errors.peso ? styles.inputError : null
                        ]
                    }
                    value={peso}
                    onChangeText={(peso) => setPeso(peso)}
                    placeholder="Peso da carga (Kg)"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Observações:
                    {formSubmetido
                        && errors.observacoes
                        && <Text style={styles.textoValidacao}>{`\b${errors.observacoes}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            formSubmetido && errors.observacoes ? styles.inputError : null
                        ]
                    }
                    value={observacoes}
                    onChangeText={(observacoes) => setObservacoes(observacoes)}
                    placeholder="Observações sobre a carga"
                    maxLength={120}
                />


                <Text style={styles.label}>Endereços:</Text>
                <View style={styles.enderecoContainer}>
                    <TouchableOpacity style={styles.labelEnderecoContainer} onPress={handleToggleEnderecoRetiradaVisible}>
                        <Text style={[styles.label, styles.labelEndereco,]}> Endereço de partida</Text>

                        {isEnderecoRetiradaVisible && <Image style={[styles.setaCollapse]} source={iconeSetaCima} resizeMode="center" />}
                        {!isEnderecoRetiradaVisible && <Image style={styles.setaCollapse} source={iconeSetaBaixo} resizeMode="center" />}

                    </TouchableOpacity>
                    {isEnderecoRetiradaVisible && (
                        <View>
                            { formSubmetido
                                && errors.enderecoRetiradaCep != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoRetiradaCep}`}</Text>}
                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoRetiradaCep ? styles.inputError : null
                                    ]
                                }
                                value={enderecoRetiradaCep}
                                onChangeText={(enderecoRetiradaCep) => setEnderecoRetiradaCep(enderecoRetiradaCep)}
                                placeholder="CEP"
                                keyboardType="numeric"
                                maxLength={8}
                            />


                            {formSubmetido
                                && errors.enderecoRetiradaLogradouro != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoRetiradaLogradouro}`}</Text>}

                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoRetiradaLogradouro ? styles.inputError : null
                                    ]
                                }
                                value={enderecoRetiradaLogradouro}
                                onChangeText={(enderecoRetiradaLogradouro) => setEnderecoRetiradaLogradouro(enderecoRetiradaLogradouro)}
                                placeholder="Logradouro"
                                maxLength={120}
                            />


                            {formSubmetido
                                && errors.enderecoRetiradaNumero != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoRetiradaNumero}`}</Text>}

                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoRetiradaNumero ? styles.inputError : null
                                    ]
                                }
                                value={enderecoRetiradaNumero}
                                onChangeText={(enderecoRetiradaNumero) => setEnderecoRetiradaNumero(enderecoRetiradaNumero)}
                                placeholder="Número"
                                maxLength={20}                            
                            />


                            {formSubmetido
                                && errors.enderecoRetiradaBairro != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoRetiradaBairro}`}</Text>}

                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoRetiradaBairro ? styles.inputError : null
                                    ]
                                }
                                value={enderecoRetiradaBairro}
                                onChangeText={(enderecoRetiradaBairro) => setEnderecoRetiradaBairro(enderecoRetiradaBairro)}
                                placeholder="Bairro"
                                maxLength={50}
                            />


                            {formSubmetido
                                && errors.enderecoRetiradaComplemento != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoRetiradaComplemento}`}</Text>}

                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoRetiradaComplemento ? styles.inputError : null
                                    ]
                                }
                                value={enderecoRetiradaComplemento}
                                onChangeText={(enderecoRetiradaComplemento) => setEnderecoRetiradaComplemento(enderecoRetiradaComplemento)}
                                placeholder="Complemento"
                                maxLength={120}
                            />

                            <View style={styles.selectGroup}>
                                {formSubmetido
                                    && errors.enderecoRetiradaUf != ''
                                    && <Text style={styles.textoValidacao}>{`\b${errors.enderecoRetiradaUf}`}</Text>}
                                <View style={styles.selectContainer}>
                                    <Picker
                                        selectedValue={JSON.stringify(enderecoRetiradaUf)}
                                        onValueChange={(value) => handleChangeValueEnderecoRetiradaUf(JSON.parse(value.toString() || '{}'))}
                                    >
                                        <Picker.Item value="" key="" label={'UF'} />
                                        {estados.map((estado: UF) =>
                                            <Picker.Item key={estado.sigla} label={estado.nome} value={JSON.stringify(estado)} />
                                        )}

                                    </Picker>
                                </View>

                                {formSubmetido
                                    && errors.enderecoRetiradaCidade != ''
                                    && <Text style={styles.textoValidacao}>{`\b${errors.enderecoRetiradaCidade}`}</Text>}
                                <View style={[styles.selectContainer, (Object.entries(enderecoRetiradaUf).length == 0) && styles.disabled]}>
                                    <Picker
                                        enabled={(Object.entries(enderecoRetiradaUf).length > 0)}
                                        selectedValue={JSON.stringify(enderecoRetiradaCidade)}
                                        onValueChange={(value) => handleChangeValueEnderecoRetiradaCidade(JSON.parse(value.toString() || '{}'))}
                                    >
                                        <Picker.Item value="" key="" label={'Cidade'} color={(Object.entries(enderecoRetiradaUf).length == 0) ? '#000000a8' : ''} />
                                        {cidadesEnderecoRetirada.map((cidade: Cidade) =>
                                            <Picker.Item key={cidade.id} label={cidade.nome} value={JSON.stringify(cidade)} />
                                        )}

                                    </Picker>
                                </View>
                            </View>
                        </View>
                    )}
                </View>


                <View style={styles.enderecoContainer}>
                    <TouchableOpacity style={styles.labelEnderecoContainer} onPress={handleToggleEnderecoEntregaVisible}>
                        <Text style={[styles.label, styles.labelEndereco,]}> Endereço de entrega</Text>

                        {isEnderecoEntregaVisible && <Image style={styles.setaCollapse} source={iconeSetaCima} resizeMode="center" />}
                        {!isEnderecoEntregaVisible && <Image style={styles.setaCollapse} source={iconeSetaBaixo} resizeMode="center" />}

                    </TouchableOpacity>

                    {isEnderecoEntregaVisible && (
                        <View>
                            {formSubmetido
                                && errors.enderecoEntregaCep != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoEntregaCep}`}</Text>}

                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoEntregaCep ? styles.inputError : null
                                    ]
                                }
                                value={enderecoEntregaCep}
                                onChangeText={(enderecoEntregaCep) => setEnderecoEntregaCep(enderecoEntregaCep)}
                                placeholder="CEP"
                                keyboardType="numeric"
                                maxLength={8}
                            />


                            {formSubmetido
                                && errors.enderecoEntregaLogradouro != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoEntregaLogradouro}`}</Text>}

                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoEntregaLogradouro ? styles.inputError : null
                                    ]
                                }
                                value={enderecoEntregaLogradouro}
                                onChangeText={(enderecoEntregaLogradouro) => setEnderecoEntregaLogradouro(enderecoEntregaLogradouro)}
                                placeholder="Logradouro"
                                maxLength={120}
                            />


                            {formSubmetido
                                && errors.enderecoEntregaNumero != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoEntregaNumero}`}</Text>}

                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoEntregaNumero ? styles.inputError : null
                                    ]
                                }
                                value={enderecoEntregaNumero}
                                onChangeText={(enderecoEntregaNumero) => setEnderecoEntregaNumero(enderecoEntregaNumero)}
                                placeholder="Número"
                                maxLength={20}
                            />

                            {formSubmetido
                                && errors.enderecoEntregaBairro != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoEntregaBairro}`}</Text>}
                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoEntregaBairro ? styles.inputError : null
                                    ]
                                }
                                value={enderecoEntregaBairro}
                                onChangeText={(enderecoEntregaBairro) => setEnderecoEntregaBairro(enderecoEntregaBairro)}
                                placeholder="Bairro"
                                maxLength={50}
                            />


                            {formSubmetido
                                && errors.enderecoEntregaComplemento != ''
                                && <Text style={styles.textoValidacao}>{`\b${errors.enderecoEntregaComplemento}`}</Text>}

                            <TextInput
                                style={
                                    [
                                        styles.input,
                                        formSubmetido && errors.enderecoEntregaComplemento ? styles.inputError : null
                                    ]
                                }
                                value={enderecoEntregaComplemento}
                                onChangeText={(enderecoEntregaComplemento) => setEnderecoEntregaComplemento(enderecoEntregaComplemento)}
                                placeholder="Complemento"
                                maxLength={120}
                            />


                            <View style={styles.selectGroup}>
                                {formSubmetido
                                    && errors.enderecoEntregaUf != ''
                                    && <Text style={styles.textoValidacao}>{`\b${errors.enderecoEntregaUf}`}</Text>}
                                <View style={styles.selectContainer}>
                                    <Picker
                                        selectedValue={JSON.stringify(enderecoEntregaUf)}
                                        onValueChange={(value) => handleChangeValueEnderecoEntregaUf(JSON.parse(value.toString() || '{}'))}
                                    >
                                        <Picker.Item value="" key="" label={'UF'} />
                                        {estados.map((estado: UF) =>
                                            <Picker.Item key={estado.sigla} label={estado.nome} value={JSON.stringify(estado)} />
                                        )}

                                    </Picker>
                                </View>

                                {formSubmetido
                                    && errors.enderecoEntregaCidade != ''
                                    && <Text style={styles.textoValidacao}>{`\b${errors.enderecoEntregaCidade}`}</Text>}
                                <View style={[styles.selectContainer, (Object.entries(enderecoEntregaUf).length == 0) && styles.disabled]}>
                                    <Picker
                                        enabled={(Object.entries(enderecoEntregaUf).length > 0)}
                                        selectedValue={JSON.stringify(enderecoEntregaCidade)}
                                        onValueChange={(value) => handleChangeValueEnderecoEntegaCidade(JSON.parse(value.toString() || '{}'))}
                                    >
                                        <Picker.Item value="" key="" label={'Cidade'} color={(Object.entries(enderecoEntregaUf).length == 0) ? '#000000a8' : ''} />
                                        {cidadesEnderecoEntrega.map((cidade: Cidade) =>
                                            <Picker.Item key={cidade.id} label={cidade.nome} value={JSON.stringify(cidade)} />
                                        )}

                                    </Picker>
                                </View>
                            </View>
                        </View>
                    )}
                </View>


                <RectButton
                    enabled={formPreenchido}
                    style={[styles.button, !formPreenchido ? styles.disabled : null]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>Salvar</Text>
                </RectButton>

                <Overlay overlayStyle={{ width: "90%" }} isVisible={visible} onBackdropPress={toggleOverlay}>
                    <Text style={{ lineHeight: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 17 }}>{`Erro ao consumir API: \n`}</Text>
                        <Text>{erroApi}</Text>
                    </Text>
                </Overlay>

            </ScrollView>
        </View >
    );

}

export default SolicitacaoFrete;