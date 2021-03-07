import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  detalhes: {
    padding: 5,
  },

  selectContainer: {
    borderRadius: 10,
    color: "#000",
    fontSize: 25,
    backgroundColor: "#8f8f8f4d",
    margin: 5,
  },

  label: {
    fontSize: 15,
    color: "#000",
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 30,
    // backgroundColor: '#e6eff49e',
    borderRadius: 7,
    padding: 2,
    paddingLeft: 5,
  },

  labelContent: {
    fontFamily: "Poppins_400Regular",
    fontWeight: "normal",
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    backgroundColor: "#005ca3",
    padding: 10,
    borderRadius: 20,
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Archivo_700Bold",
  },

  titleContainer: {
    padding: 5,
  },

  subtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#005ca3",
    fontSize: 20,
    lineHeight: 25,
    padding: 5,
    paddingTop: 10,
  },
});

export default styles;
