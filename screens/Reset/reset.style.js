import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 150,
    backgroundColor: COLORS.lightWhite
  },
  titleContainer:{
    marginHorizontal: 20,
    gap: 10,
    marginTop: 80
  },
  containerTitle:{
    fontFamily: FONT.bold,
    fontSize: SIZES.large
  },
  subTitle:{
    fontFamily: FONT.regular,
    fontSize: SIZES.medium
  },

  emailContainer:{
    marginHorizontal: 10,
    marginTop: SIZES.xxLarge
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 55,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: "100%",
  },
  inInput: {
    fontFamily: FONT.regular,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
  },

  buttonContainer:{
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 50
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
