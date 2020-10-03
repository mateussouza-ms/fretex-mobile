import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        
    },
    
    body: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: "center",
        padding: 20,        
    },


    title: {
        fontFamily: 'Poppins_400Regular',
        color: '#005ca3',
        fontSize: 20,
        lineHeight: 35,
        marginTop: -50,
    },

    titleBold: {
        fontFamily: 'Poppins_600SemiBold',
        lineHeight: 70
    },

    subtitle: {
        fontSize: 15,
        lineHeight: 25,
    },

    buttonsContainer: {
        flexDirection: "row",
       
        justifyContent: "space-between",
    },

    button: {
        height: 150,
        width: '48%',
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 20,
        justifyContent: "space-between",
    },

    buttonPrimary: {
        backgroundColor: '#9871F5'
    },

    buttonSecondary: {
        backgroundColor: '#04D361'
    },

    buttonText: {
        fontFamily: 'Archivo_700Bold',
        color: '#FFF',
        fontSize: 20,
    },

    totalConnections: {
        fontFamily: 'Poppins_400Regular',
        color: '#d4c2ff',
        fontSize: 12,
        lineHeight: 20,
        maxWidth: 145,
        marginTop: 40,
    }

})

export default styles;