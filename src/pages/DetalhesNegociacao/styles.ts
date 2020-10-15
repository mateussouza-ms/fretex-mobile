import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    detalhes: {
        paddingTop: 10,
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

    subtitle: {
        lineHeight: 25,
    },
})

export default styles;