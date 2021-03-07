import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171d31",
    justifyContent: "center",
    padding: 10,
  },

  banner: {
    width: "80%",
    resizeMode: "contain",
    alignSelf: "center",
  },

  title: {
    fontFamily: "Archivo_700Bold",
    color: "#fff",
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 25,
  },

  input: {
    backgroundColor: "#e6e6fa",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    color: "#000",
    fontSize: 20,
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    backgroundColor: "#005ca3",
    padding: 10,
    borderRadius: 20,
    width: 250,
    alignSelf: "center",
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Archivo_700Bold",
  },

  linksContainer: {
    flexDirection: "row",

    justifyContent: "center",
  },

  textLink: {
    color: "#b3c8d5",
    fontFamily: "Archivo_700Bold",
    textAlign: "center",
    fontSize: 14,
  },

  checkboxContainer: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    marginTop: -5,
  },

  checkboxText: {
    color: "#fff",
  },

  textoErro: {
    color: "#d85a5ae3",
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: "Poppins_600SemiBold",
  },

  versaoContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column-reverse",
  },

  versaoTexto: {
    color: "#fff",
    fontSize: 11,
  },
});

export default styles;
