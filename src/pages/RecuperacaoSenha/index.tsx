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

function RecuperacaoSenha() {

    const { navigate } = useNavigation();

    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);
    const [formSubmetido, setFormSubmetido] = useState(false);


    const errors = {
        email: obrigatorio(email) || isEmail(email),
    };

    const formPreenchido = email != '';
    const formValido = !errors.email;


    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function handleSubmit() {
        setLoading(true);
        
        setFormSubmetido(true);

        if (!formValido) {
            return;
        }

        api.post(
            'usuarios/recuperacao-senha',
            {},
            {
                params: {
                    email,
                }
            }
        ).then(response => {
            console.log('navigate(RedefinicaoSenha);')
            setLoading(false);
            navigate('RedefinicaoSenha');
        }).catch(error => {
            setLoading(false);
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();
        });

    }

    return (
        <View style={styles.container}>
            <PageHeader title="Recuperação de senha" />

            <Text style={styles.title}>
                <Text>Para recuperar sua senha, informe abaixo o e-mail cadastrado.</Text>
            </Text>
            <Text style={styles.label}>E-mail:
               {formSubmetido
                    && errors.email
                    && <Text style={styles.textoValidacao}>{`\b${errors.email}`}</Text>}
            </Text>
            <TextInput
                style={
                    [
                        styles.input,
                        formSubmetido && errors.email ? styles.inputError : null
                    ]
                }
                value={email}
                onChangeText={(email) => setEmail(email)}
                placeholder="E-mail"
                keyboardType="email-address"
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

export default RecuperacaoSenha;