import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Overlay } from 'react-native-elements';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import { max, obrigatorio, isEmail, min } from '../../valiadacao/validators';

import styles from './styles';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/auth';

function RedefinicaoSenha() {

    const { navigate } = useNavigation();

    const [loading, setLoading] = useState(false);

    const [codigoRecuperacao, setCodigoRecuperacao] = useState('');
    const [senha, setSenha] = useState('');

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);
    const [formSubmetido, setFormSubmetido] = useState(false);


    const errors = {
        codigoRecuperacao: obrigatorio(codigoRecuperacao) || min(codigoRecuperacao, 6),
        senha: obrigatorio(senha) || max(senha, 120),
    };

    const formPreenchido = codigoRecuperacao != '' && senha != '';
    const formValido = !errors.codigoRecuperacao && !errors.senha;


    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function handleSubmit() {
        setFormSubmetido(true);

        if (!formValido) {
            return;
        }

        setLoading(true);
        api.post(
            'usuarios/redefinicao-senha',
            {},
            {
                params: {
                    codigoRecuperacao,
                    novaSenha: senha,
                }
            }


        ).then(response => {
            setLoading(false);
            Alert.alert(
                "Sucesso!",
                "Senha redefinida com sucesso. Você será redirecionado para a tela de login e poderá utilizar a nova senha.",
                [
                    {
                        text: "OK",
                        onPress: () => { navigate('Login'); }
                    }
                ],
                { cancelable: true }
            );
        }).catch(error => {
            setLoading(false);
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();
        });

    }

    return (
        <View style={styles.container}>
            <PageHeader title="Redefinição de senha" />

            <Text style={styles.title}>
                <Text>Agora, informe abaixo o código que foi enviado para o e-mail informado e a nova senha a ser cadastrada.</Text>
            </Text>
            <Text style={styles.label}>Código de recuperação:
               {formSubmetido
                    && errors.codigoRecuperacao
                    && <Text style={styles.textoValidacao}>{`\b${errors.codigoRecuperacao}`}</Text>}
            </Text>
            <TextInput
                style={
                    [
                        styles.input,
                        formSubmetido && errors.codigoRecuperacao ? styles.inputError : null
                    ]
                }
                value={codigoRecuperacao}
                onChangeText={(codigoRecuperacao) => setCodigoRecuperacao(codigoRecuperacao)}
                placeholder="Código enviado por e-mail"
                keyboardType="numeric"
                maxLength={6}
            />

            <Text style={styles.label}>Nova senha:
               {formSubmetido
                    && errors.senha
                    && <Text style={styles.textoValidacao}>{`\b${errors.senha}`}</Text>}
            </Text>
            <TextInput
                style={
                    [
                        styles.input,
                        formSubmetido && errors.senha ? styles.inputError : null
                    ]
                }
                value={senha}
                onChangeText={(senha) => setSenha(senha)}
                placeholder="Nova senha a ser cadastrada"
                maxLength={120}
            />

            <RectButton
                enabled={formPreenchido}
                style={[styles.button, !formPreenchido ? styles.buttonDisabled : null]}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Salvar</Text>
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

export default RedefinicaoSenha;