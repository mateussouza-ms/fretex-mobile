import React, { ReactNode, useState } from 'react';
import { View, Image, Text, Modal, Alert, TouchableHighlight, StyleSheet, TouchableOpacity } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import backIcon from '../../assets/images/icons/back.png';
import logoImg from '../../assets/images/logo-fretex-icone-lado.png';

import styles from './styles';
import { useAuth } from '../../contexts/auth';
import { Avatar } from 'react-native-elements';

import AvatarImage from '../../assets/images/icons/user-avatar.png'

interface PageHeaderProps {
    title: string;
    headerRight?: ReactNode;
}



const PageHeader: React.FC<PageHeaderProps> = ({ title, headerRight, children }) => {
    const { navigate } = useNavigation();
    const { signOut } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const { usuarioLogado } = useAuth();

    function handleGoBack() {
        //navigate('Landing');
        signOut();
    }

    function handleSair() {
        Alert.alert(
            "Confirmação",
            "Realmente deseja sair?",
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "SIM",
                    onPress: () => { signOut() }
                }
            ],
            { cancelable: true, }
        );
    }

    return (

        <View style={styles.container}>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalClose} onPress={() => setModalVisible(false)}> x </Text>

                        <Text style={styles.modalText}>{usuarioLogado?.nome}</Text>
                        <Text>emaildousuario@gmail.com</Text>

                        <View style={styles.modalButtonsGroup}>
                            <TouchableHighlight
                                style={styles.modalButton}
                                onPress={() => {
                                    
                                }}
                            >
                                <Text style={styles.modalButtonText}>Alterar senha</Text>
                            </TouchableHighlight>

                            {usuarioLogado?.perfilSelecionado == 'PRESTADOR_SERVICOS' &&
                                <TouchableHighlight
                                    style={styles.modalButton}
                                    onPress={() => {
                                       
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>Adicionar veículo</Text>
                                </TouchableHighlight>
                            }

                            <TouchableHighlight
                                style={styles.modalButton}
                                onPress={() => {
                                    
                                }}
                            >
                                <Text style={styles.modalButtonText}>Atualizar cadastro</Text>
                            </TouchableHighlight>
                        </View>

                        <TouchableOpacity
                            style={styles.link}
                            onPress={handleSair}
                        >
                            <Text style={styles.textoLink}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.topbar}>
                {/*<BorderlessButton onPress={handleGoBack}>
                    <Image source={backIcon} resizeMode="contain" />
                </BorderlessButton>*/}

                <Image style={styles.logo} source={logoImg} resizeMode="contain" />
                <Avatar
                    containerStyle={[
                        styles.avatar,
                        usuarioLogado?.perfilSelecionado == 'CLIENTE' && styles.avatarCliente,
                        usuarioLogado?.perfilSelecionado == 'PRESTADOR_SERVICOS' && styles.avatarPrestador
                    ]}
                    //avatarStyle= {{borderWidth: 5, borderColor: '#9871F5'}}

                    onPress={() => setModalVisible(true)}
                    rounded
                    source={AvatarImage}
                />
            </View>


            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {headerRight}
            </View>

            {children}
        </View>
    )
}

export default PageHeader;