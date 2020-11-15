import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { createNavigatorFactory, useNavigation } from '@react-navigation/native';
import { Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import PageHeader from '../../components/PageHeader';

import api from '../../services/api';

import { max, obrigatorio, isEmail, min } from '../../valiadacao/validators';

import styles from './styles';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/auth';

function InformacaoEntrega({ route, navigation }: any) {
    const { usuarioLogado } = useAuth();
    const { carga } = route.params;
    const { navigate } = useNavigation();


    const [loading, setLoading] = useState(false);
    const [showDatePickerEntrega, setShowDatePickerEntrega] = useState(false);
    const [tipoDatePiker, settipoDatePiker] = useState<"time" | "date" | "datetime" | "countdown" | undefined>('date');

    const [dataEntrega, setDataEntrega] = useState<Date | null>(new Date());

    const [erroApi, setErroApi] = useState('');
    const [visible, setVisible] = useState(false);
    const [formSubmetido, setFormSubmetido] = useState(false);

    const formPreenchido = (dataEntrega != null);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function handleSubmit() {

        setFormSubmetido(true);

        setLoading(true);
        api.put(
            `cargas/${carga.id}/dataEntrega`,
            {
                dataHora: dataEntrega,
            }
        ).then(response => {
            let carga = response.data;

            Alert.alert(
                'Sucesso!',
                'Informação salva com sucesso.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigate('DetalhesCarga', { carga, usuarioLogado })
                    }
                ]
            )  
        }).catch(error => {
            setErroApi(JSON.stringify(error.response.data));
            toggleOverlay();            
        }).finally(()=> setLoading(false));
        
    }


    return (
        <View style={styles.container}>
            <PageHeader title="Informar entrega de carga" />

            <ScrollView style={styles.scrollCampos}>

                <Text style={styles.label}>Data de entrega: *</Text>
                <TextInput
                    style={
                        [
                            styles.input,
                        ]
                    }
                    value={dataEntrega
                        ? format(new Date(dataEntrega.toString()), "dd/MM/yyyy HH:mm")
                        : ''
                    }
                    placeholder="Data que a carga foi entregue"
                    onTouchEnd={() => setShowDatePickerEntrega(true)}
                />

                {showDatePickerEntrega &&
                    <DateTimePicker
                        value={dataEntrega ? dataEntrega : new Date()}
                        mode={tipoDatePiker}
                        display='default'
                        onChange={(event, date) => {
                            setShowDatePickerEntrega(false);
                            if (event.type == 'set') {

                                if (date) {
                                    setDataEntrega(date);
                                    if (tipoDatePiker == 'date') {
                                        settipoDatePiker('time');
                                        setShowDatePickerEntrega(true);
                                    }
                                }

                            }
                        }}
                        minimumDate={new Date()}
                    />
                }

                <RectButton
                    enabled={formPreenchido}
                    style={[styles.button, !formPreenchido ? styles.buttonDisabled : null]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>Confirmar entrega</Text>
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

export default InformacaoEntrega;