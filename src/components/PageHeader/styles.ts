import { Archivo_500Medium } from "@expo-google-fonts/archivo";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingVertical: 25,
        backgroundColor: '#4682B4',
        height: 100
    },

    topbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    logo: {
        width: 100,
        resizeMode: "contain",
        height: 30,
        marginRight: -15,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontFamily: 'Archivo_700Bold',
        color: '#fff',
        fontSize: 20,
        lineHeight: 20,
        maxWidth: 2000,
        marginVertical: 10,
    },

    modalContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        marginTop: 22,
    },

    modalClose: {
        alignSelf: 'flex-start',
        marginTop: -25,
        marginLeft: -20,
        fontSize: 18,
        marginBottom: 5,
    },

    modalView: {
        marginVertical: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 250,
        height: 'auto',
    },

    modalText: {
        textAlign: "center",
        fontWeight: 'bold',
    },

    modalButtonsGroup: {
        marginTop: 30,
        alignItems: "center",
        width: '100%',
    },

    modalButton: {
        backgroundColor: "#2196F3",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: '80%',
        marginVertical: 5,
    },

    modalButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

    avatar: {
        marginTop: 5,
        marginRight: 5,        
        width: 40,
        height: 40,
        marginBottom: -3,
        borderRadius: 50
    },

    avatarCliente: {
        borderWidth: 3,
        borderColor: '#9871F5',
    },
    
    avatarPrestador: {
        borderWidth: 3,
        borderColor: '#04D361',
    },

    link: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: 'center',
    },

    textoLink: {
        color: '#02459d', 
        textDecorationLine: 'underline'
    },


})

export default styles;