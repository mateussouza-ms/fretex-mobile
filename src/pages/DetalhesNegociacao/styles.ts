import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  detalhes: {
    paddingTop: 10,
    margin: 10,
  },

  list: {
    borderTopWidth: 1,
    borderColor: "#cbd2d9",
  },

  label: {
    fontSize: 15,
    color: "#000",
    fontFamily: "Poppins_600SemiBold",
    margin: 3,
    borderRadius: 7,
    padding: 2,
    paddingLeft: 5,
  },

  labelContent: {
    fontFamily: "Poppins_400Regular",
    fontWeight: "normal",
  },

  labelList: {
    backgroundColor: "#fff",
    marginLeft: 10,
  },

  listButtonsContainer: {
    flexDirection: "row",
    marginTop: 15,
    borderWidth: 0,
  },

  buttonList: {
    borderWidth: 0,
    backgroundColor: "#edededcf",
  },

  buttonListText: {
    color: "#005ca3",
    fontWeight: "bold",
    fontSize: 16,
  },

  listItem: {
    backgroundColor: "#f0f0f0c7",
    margin: 7,
    borderRadius: 15,
    borderWidth: 2,
    borderBottomWidth: 2,
    padding: 10,
  },

  listItemAceito: {
    backgroundColor: "#00660047",
  },

  listItemNaoAceito: {
    backgroundColor: "#b8b8b89c",
  },

  subtitle: {
    lineHeight: 25,
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    margin: 30,
    backgroundColor: "#fb5050",
    padding: 10,
    borderRadius: 20,
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  buttonDatas: {
    backgroundColor: "#035e03",
    marginTop: 0,
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Archivo_700Bold",
  },
});

export default styles;
