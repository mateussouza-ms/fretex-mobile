import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  body: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },

  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    height: 80,
    width: "85%",
    backgroundColor: "#3CB371",
    borderRadius: 8,
    padding: 20,
    justifyContent: "flex-start",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    fontFamily: "Archivo_700Bold",
    color: "#FFF",
    fontSize: 20,
    marginLeft: 10,
    maxWidth: "95%",
    width: "90%",
  },
});

export default styles;
