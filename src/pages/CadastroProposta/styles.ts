import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Archivo_700Bold",
  },

  label: {
    marginTop: 15,
    marginLeft: 10,
    fontSize: 15,
    color: "#000",
    fontFamily: "Poppins_400Regular",
  },

  scrollCampos: {},

  textoValidacao: {
    color: "red",
    fontSize: 13,
  },

  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
});

export default styles;
