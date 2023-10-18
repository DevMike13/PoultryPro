import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 50,
    backgroundColor: COLORS.lightWhite
  },
  contentConatiner:{
    justifyContent: "center",
    paddingHorizontal: 15
  },
  title:{
    fontFamily: FONT.bold,
    fontSize: SIZES.large
  },
  buttonContainer:{
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 20
  },
  buttonText:{
    fontFamily: FONT.medium,
    fontSize: SIZES.small
  },
  cancelButton:{
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray
  },
  resetButton:{
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    backgroundColor: "#277df8"
  }
});

export default styles;
