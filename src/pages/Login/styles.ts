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

  textLogo: {
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    fontSize: 60,
    color: "#FA9435",
    marginBottom: 40,
  },

  title: {
    fontFamily: "Archivo_700Bold",
    color: "#fff",
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 25,
  },

  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  input: {
    backgroundColor: "#e6e6fa",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    color: "#000",
    fontSize: 20,
  },

  inputDdd: {
    width: "30%",
  },

  inputNumero: {
    width: "70%",
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

  label: {
    marginLeft: 10,
    fontSize: 15,
  },

  scrollCampos: {
    paddingTop: 50,
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
