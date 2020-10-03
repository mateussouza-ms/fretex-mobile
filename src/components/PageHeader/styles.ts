import { Archivo_500Medium } from "@expo-google-fonts/archivo";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: 25,
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
})

export default styles;