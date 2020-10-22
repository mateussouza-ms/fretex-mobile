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
        flexDirection: "column",      
    },


    title: {
        fontFamily: 'Poppins_600SemiBold',
        color: '#005ca3',
        fontSize: 20,
        lineHeight: 35,
        marginTop: -50,
    },

    subtitle: {
        fontSize: 15,
        lineHeight: 40,
        fontFamily: 'Poppins_400Regular',
        fontWeight: "400",
    },

    linkContainer: {
        height: 80,
        marginTop: -100,
    },


    textLink: {
        color: '#005ca3',
        fontFamily: "Archivo_700Bold",
        textAlign: "center",
        fontSize: 14,
        textDecorationLine: "underline",
        textDecorationColor: '#000',
    },




})

export default styles;