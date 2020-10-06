import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Overlay } from 'react-native-elements';

import { withFormik, FormikErrors } from 'formik';
import * as Yup from 'yup';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';

const CadastroUsuario = (props: any) => {
    const { navigate } = useNavigation();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefoneDdd, setTelefoneDdd] = useState('');
    const [telefoneNumero, setTelefoneNumero] = useState('');
    const [senha, setSenha] = useState('');
    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(true);

    async function handleSubmit() {

        let tipoPessoa = 'FÍSICA';

        if (cpf.length > 11) {
            tipoPessoa = 'JURÍDICA';
        }

        await api
            .post('usuarios', {
                "nome": nome,
                "cnp": cpf,
                "tipoPessoa": tipoPessoa,
                "email": email,
                "telefone": {
                    "ddd": telefoneDdd,
                    "numero": telefoneNumero
                },
                "senha": senha
            })
            .then(response => {
                console.log(response.data);
                //let { id } = response.data;
                //navigate('SelecaoPerfil', { usuarioId: id, usuarioNome: nome });
            })
            .catch(error => {
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();
            });
    }

    const toggleOverlay = () => {
        console.log("toggleOverlay");
        console.log("props.status: " + props.status);
        props.setStatus(null);
        console.log("props.status: " + props.status);
    };

    function alerta() {
        Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false },
        );
    }


    return (
        <View style={styles.container}>
            <PageHeader title="Cadastro de usuário" />

            <ScrollView style={styles.scrollCampos}>

                {props.isSubmitting && <ActivityIndicator />}

                <Text style={styles.label}>Nome completo:
                {props.touched.email
                        && props.errors.nome
                        && <Text style={styles.textoValidacao}>{`\b${props.errors.nome}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            props.touched.nome && props.errors.nome && styles.inputError
                        ]
                    }
                    value={props.values.nome}
                    onChangeText={(text) => props.setFieldValue('nome', text)}
                    placeholder="Nome"
                    maxLength={120}
                />


                <Text style={styles.label}>CPF/CNPJ:
                {props.touched.cnp
                        && props.errors.cnp
                        && <Text style={styles.textoValidacao}>{`\b${props.errors.cnp}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            props.touched.cnp && props.errors.cnp && styles.inputError
                        ]
                    }
                    value={props.values.cnp}
                    onChangeText={(text) => props.setFieldValue('cnp', text)}
                    placeholder="CPF/CNPJ"
                    keyboardType="numeric"
                    maxLength={14}
                />

                <Text style={styles.label}>E - mail:
                {props.touched.email
                        && props.errors.email
                        && <Text style={styles.textoValidacao}>{`\b${props.errors.email}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            props.touched.email && props.errors.email && styles.inputError
                        ]
                    }
                    value={props.values.email}
                    onChangeText={(text) => props.setFieldValue('email', text)}
                    placeholder="E-mail"
                    keyboardType="email-address"
                />


                <Text style={styles.label}>Telefone:
                    {props.touched.telefone?.ddd
                        && props.errors.telefone?.ddd
                        && <Text style={styles.textoValidacao}>{` DDD ${props.errors.telefone?.ddd}`}</Text>}
                    {props.touched.telefone?.ddd
                        && props.errors.telefone?.ddd
                        && props.touched.telefone?.numero
                        && props.errors.telefone?.numero
                        && <Text style={styles.textoValidacao}>{' |'}</Text>}

                    {props.touched.telefone?.numero
                        && props.errors.telefone?.numero
                        && <Text style={styles.textoValidacao}>{` Número ${props.errors.telefone?.numero}`}</Text>}
                </Text>
                <View style={styles.inputGroup}>
                    <View style={styles.inputDdd}>
                        <TextInput
                            style={
                                [
                                    styles.input,
                                    props.touched.telefone?.ddd && props.errors.telefone?.ddd && styles.inputError
                                ]
                            }
                            value={props.values.telefone.ddd}
                            onChangeText={(text) => props.setFieldValue('telefone.ddd', text)}
                            placeholder="DDD"
                            keyboardType="numeric"
                            maxLength={2}
                        />
                    </View>
                    <View style={styles.inputNumero}>
                        <TextInput
                            style={
                                [
                                    styles.input,
                                    props.touched.telefone?.numero && props.errors.telefone?.numero && styles.inputError
                                ]
                            }
                            value={props.values.telefone.numero}
                            onChangeText={(text) => props.setFieldValue('telefone.numero', text)}
                            placeholder="Número"
                            keyboardType="numeric"
                            maxLength={9}
                        />
                    </View>
                </View>

                <Text style={styles.label}>Senha:
                {props.touched.senha
                        && props.errors.senha
                        && <Text style={styles.textoValidacao}>{`\b${props.errors.senha}`}</Text>}
                </Text>
                <TextInput
                    style={
                        [
                            styles.input,
                            props.touched.senha && props.errors.senha && styles.inputError
                        ]
                    }
                    value={props.values.senha}
                    onChangeText={(text) => props.setFieldValue('senha', text)}
                    placeholder="Senha"
                    secureTextEntry={true}
                    maxLength={120}
                />
                <RectButton style={styles.button} onPress={props.handleSubmit}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </RectButton>

                <Button title="Open Overlay" onPress={toggleOverlay} />


                <Overlay overlayStyle={{ width: "90%" }} isVisible={!!props.status} onBackdropPress={toggleOverlay}>
                    <Text style={{ lineHeight: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 17 }}>{`Erro ao consumir API: \n`}</Text>


                    </Text>
                </Overlay>
            </ScrollView>


        </View>
    );

}

export default withFormik({
    mapPropsToValues: () => ({
        nome: '',
        cnp: '',
        email: '',
        telefone: { ddd: '', numero: '' },
        senha: '',
        tipoPessoa: '',
    }),

    validationSchema: Yup.object().shape({
        nome: Yup.string()
            .max(120, 'O nome deve ter no máximo 120 caracteres')
            .required('Obrigatório'),
        cnp: Yup.string()
            .min(11, 'O CPF/CNPJ deve ter no mínimo 11 caracteres')
            .max(120, 'O CPF/CNPJ deve ter no máximo 14 caracteres')
            .required('Obrigatório'),
        email: Yup.string()
            .email('Digite um e-mail válido')
            .required('Obrigatório'),
        telefone: Yup.object().shape({
            ddd: Yup.string()
                .min(2, 'deve ter no mínimo 2 caracteres')
                .max(2, 'deve ter no máximo 2 caracteres')
                .required('obrigatório'),
            numero: Yup.string()
                .min(8, 'deve ter no mínimo 8 caracteres')
                .max(9, 'deve ter no máximo 9 caracteres')
                .required('obrigatório'),
        }),
        senha: Yup.string()
            .max(9, 'A senha deve ter no máximo 120 caracteres')
            .required('Obrigatório'),
    }),

    handleSubmit: async (values, { setSubmitting, setFieldError, setStatus }) => {

        values.tipoPessoa = 'FÍSICA';

        if (values.cnp.length > 11) {
            values.tipoPessoa = 'JURÍDICA';
        }

        console.log(values);

        await api.post('usuarios', values)
            .then(response => {
                console.log(response.data);
                //let { id } = response.data;
                //navigate('SelecaoPerfil', { usuarioId: id, usuarioNome: nome });

            })
            .catch(error => {
                console.log(JSON.stringify(error));
                setSubmitting(false);
                setFieldError('erroapi', JSON.stringify(error));
                setStatus({ visible: true })
            });
    }
})(CadastroUsuario);