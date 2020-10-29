import React, { ReactNode } from 'react';
import { View, Image, Text } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import backIcon from '../../assets/images/icons/back.png';
import logoImg from '../../assets/images/logo-fretex-icone-lado.png';

import styles from './styles';
import { useAuth } from '../../contexts/auth';

interface PageHeaderProps {
    title: string;
    headerRight?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({title, headerRight, children}) => {
    const { navigate } = useNavigation();
    const {signOut} = useAuth();

    function handleGoBack() {
        //navigate('Landing');
        signOut();
    }

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <BorderlessButton onPress={handleGoBack}>
                    <Image source={backIcon} resizeMode="contain" />
                </BorderlessButton>

                <Image style={styles.logo} source={logoImg} resizeMode="contain"/>
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