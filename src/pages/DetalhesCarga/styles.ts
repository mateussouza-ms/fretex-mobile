import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    detalhes: {
        margin: 10,
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
        flex: 1,
    },

    label: {
        fontSize: 15,
        color: '#000',
        fontFamily: 'Poppins_600SemiBold',
        margin: 3,
        // backgroundColor: '#e6eff49e',
        borderRadius: 7,
        padding: 2,
        paddingLeft: 5,
    },

    labelSelect: {
        color: '#000',
        // backgroundColor: '#e6eff49e',
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
        textAlignVertical: "center",
        marginHorizontal: 15,
    },

    textoNegociacoes: {
        margin: 15,
        marginBottom: 0,
        textAlign: 'center',
    },

    link: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: 'center',
    },

    textoLink: {
        color: '#02459d', 
        textDecorationLine: 'underline'
    },

    textPlus: {
        color: '#02459d', 
        textDecorationLine: "none",
        fontWeight: "bold",
        fontSize: 20
    },

})

export default styles;