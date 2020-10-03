import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Overlay } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import styles from './styles';

function CadastroUsuario() {
    const { navigate } = useNavigation();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dddTelefone, setDddTelefone] = useState('');
    const [numeroTelefone, setNumeroTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [tituloErro, setTituloErro] = useState('');
    const [corpoErro, setCorpoErro] = useState('');
    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);

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
                    "ddd": dddTelefone,
                    "numero": numeroTelefone
                },
                "senha": senha
            })
            .then(response => {
                console.log(response.data);
                setUsuario(response.data);
            }).catch(error => {
                {/*setTituloErro(error.response.data.titulo);
                setCorpoErro(JSON.stringify(error.response.data.campos));
                */}
                setErroApi(JSON.stringify(error.response.data));
                toggleOverlay();

            });



        //let { id } = response.data;

        //navigate('SelecaoPerfil', { usuarioId: id, usuarioNome: nome });

    }

    const toggleOverlay = () => {
        setVisible(!visible);
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

                <Text style={styles.label}>Nome completo:</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={(nome) => setNome(nome)}
                    placeholder="Nome"
                />


                <Text style={styles.label}>CPF/CNPJ:</Text>
                <TextInput
                    style={styles.input}
                    value={cpf}
                    onChangeText={(cpf) => setCpf(cpf)}
                    placeholder="CPF/CNPJ"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>E-mail:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                    placeholder="E-mail"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Telefone:</Text>
                <View style={styles.inputGroup}>
                    <View style={styles.inputDdd}>
                        <TextInput
                            style={styles.input}
                            value={dddTelefone}
                            onChangeText={(dddTelefone) => setDddTelefone(dddTelefone)}
                            placeholder="DDD"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputNumero}>
                        <TextInput
                            style={styles.input}
                            value={numeroTelefone}
                            onChangeText={(numeroTelefone) => setNumeroTelefone(numeroTelefone)}
                            placeholder="Número"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <Text style={styles.label}>Senha:</Text>
                <TextInput
                    style={styles.input}
                    value={senha}
                    onChangeText={(senha) => setSenha(senha)}
                    placeholder="Senha"
                    secureTextEntry={true}
                />
                <RectButton style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </RectButton>

                <Button title="Open Overlay" onPress={toggleOverlay} />


                <Overlay overlayStyle={{width: "90%"}} isVisible={visible} onBackdropPress={toggleOverlay}>
                    <Text style={{ lineHeight: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 17 }}>{`Erro ao consumir API: \n`}</Text>
                        <Text>{erroApi}</Text>
                    </Text>
                </Overlay>


            </ScrollView>
        </View>
    );

}

export default CadastroUsuario;