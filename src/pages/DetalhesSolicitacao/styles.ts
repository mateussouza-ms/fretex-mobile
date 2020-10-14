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
        fontSize: 25,
        flex: 1,
    },

    label: {
        fontSize: 15, 
        color: '#000',
        fontFamily: 'Poppins_600SemiBold',
        margin: 3,
        backgroundColor: '#e6eff49e',
        borderRadius: 7,
        padding: 2,
        paddingLeft: 5,
    },

    labelContent: {
        fontFamily: 'Poppins_400Regular',
        fontWeight: "normal",
    },

    labelList:{
        backgroundColor: '#fff',
        marginLeft: 10,
    },

    filterGroup: {
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
    },

})

export default styles;