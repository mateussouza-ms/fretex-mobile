import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },


    inputGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    input: {
        backgroundColor: '#e6e6fa',
        borderRadius: 10,
        margin: 10,
        marginTop: 5,
        padding: 10,
        color: '#000',
        fontSize: 20
    },

    inputDdd: {
        width: '30%',
    },

    inputNumero: {
        width: '70%',
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        backgroundColor: '#005ca3',
        padding: 10,
        borderRadius: 20,
        
    },

    buttonDisabled:{
        opacity: 0.6,
    },
    

    buttonText: {
        fontSize: 20,
        color: '#fff',
        fontFamily: "Archivo_700Bold",

    },

    label: {
        marginLeft: 10,
        fontSize: 15,
        color: '#000',
        fontFamily: 'Poppins_400Regular',
        marginTop: 15,
    },

    scrollCampos: {
        paddingTop: 30
    },

    submitButton: {
        backgroundColor: '#04d361',
        height: 56,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    submitButtonText: {
        color: '#fff',
        fontFamily: "Archivo_700Bold",
        fontSize: 16,
    },

    textoValidacao: {
        color: 'red',
        fontSize: 13,
    },

    inputError: {
        borderColor: 'red', 
        borderWidth: 1,
    }
})

export default styles;