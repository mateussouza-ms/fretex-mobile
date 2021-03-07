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

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Archivo_700Bold",
  },

  label: {
    marginLeft: 10,
    marginTop: 15,
    fontSize: 15,
    color: "#000",
    fontFamily: "Poppins_400Regular",
  },

  labelEnderecoContainer: {
    flexDirection: "row",
    height: 25,
    alignItems: "center",
  },

  labelEndereco: {
    marginLeft: 0,
    marginTop: 0,
    width: "90%",
  },

  scrollCampos: {
    paddingTop: 10,
  },

  textoValidacao: {
    color: "red",
    fontSize: 13,
  },

  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },

  setaCollapse: {
    height: 20,
  },

  selectGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },

  selectContainer: {
    width: "48%",
    backgroundColor: "#e6e6fa",
    borderRadius: 10,
    paddingLeft: 5,
    color: "#000",
    fontSize: 20,
  },

  enderecoContainer: {
    backgroundColor: "#e3e0f563",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },

  checkboxContainer: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    marginTop: -5,
    marginLeft: 2,
  },

  checkboxText: {
    fontFamily: "Poppins_400Regular",
    fontWeight: "normal",
  },
});

export default styles;
