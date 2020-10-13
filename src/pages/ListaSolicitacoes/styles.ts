import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f7',
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
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
    },

    filterGroup: {
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
    },

})

export default styles;