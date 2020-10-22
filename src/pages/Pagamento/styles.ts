import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    detalhes: {
        padding: 5,       
    },

    scrollView: {
        //padding: 5,
    },

    list: {
        borderTopWidth: 1,
        borderColor: '#cbd2d9',
    },

    selectContainer: {
        borderRadius: 10,
        color: '#000',
        fontSize: 25,       
        backgroundColor: '#8f8f8f4d',
        margin: 5,
    },

    label: {
        fontSize: 15,
        color: '#000',
        fontFamily: 'Poppins_600SemiBold',
        lineHeight: 30,
        //backgroundColor: '#e6eff49e',
        borderRadius: 7,
        padding: 2,
        paddingLeft: 5,
    },

    labelContent: {
        fontFamily: 'Poppins_400Regular',
        fontWeight: "normal",
    },

    labelList: {
        backgroundColor: '#fff',
        marginLeft: 10,
    },

    filterGroup: {
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
    },

    listButtonsContainer: {
        flexDirection: 'row',
        marginTop: 15,
        borderWidth: 0,
    },

    buttonList: {
        borderWidth: 0,
        backgroundColor: '#edededcf',
    },


    buttonListText: {
        color: '#005ca3',
        fontWeight: "bold",
        fontSize: 16
    },
    
    listItem: {
        backgroundColor: '#edededcf',
        margin: 7,
        borderRadius: 15,
        borderWidth: 2,
        borderBottomWidth: 2,
        padding: 10,
    },


    button: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        backgroundColor: '#005ca3',
        padding: 10,
        borderRadius: 20,
        
    },    

    buttonText: {
        fontSize: 20,
        color: '#fff',
        fontFamily: "Archivo_700Bold",
    },

    titleContainer: {
        padding: 5,
    },
    
    title: {
        fontFamily: 'Poppins_600SemiBold',
        color: '#005ca3',
        fontSize: 20,
        lineHeight: 45,
        padding: 5,
        paddingTop: 10,
        textAlign: 'center',
    },

    subtitle: {
        fontFamily: 'Poppins_400Regular',
        color: '#005ca3',
        fontSize: 20,
        lineHeight: 25,
        padding: 5,
        paddingTop: 10,
    },
})

export default styles;