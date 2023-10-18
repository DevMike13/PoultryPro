import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    backgroundColor: COLORS.lightWhite
  },
  headerContainer:{
    alignItems: "center",
    height: "20%",
    paddingHorizontal: 25,
    paddingVertical: 25
  },
  appTitle : {
    fontFamily: FONT.regular,
    fontSize: SIZES.xxLarge,
    color: COLORS.secondary,
  },
  appSubTitle : {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.secondary,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  userName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
  passWord: {
    fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
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
  logoBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: COLORS.white,
  },
  loginBtn: {
    marginHorizontal: SIZES.small,
    marginVertical: SIZES.xxLarge,
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#277df8",
    borderRadius: SIZES.medium
  },
  loginBtnText: {
    color: COLORS.white,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
  },

  // FORGOT
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 30,
  },
  modalButton: {
    backgroundColor: '#277df8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // REG
  regContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.small,
    height: 50,
  },
  regWrapper: {
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: "100%",
  },
  regBtn: {
    height: "100%",
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  regBtnText: {
    color: "#277df8",
    fontFamily: FONT.regular,
  },
  divider: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  dividerLineLeft:{
    width: 120,
    height: 1,
    backgroundColor: COLORS.gray2
  },
  dividerLineRight:{
    width: 120,
    height: 1,
    backgroundColor: COLORS.gray2
  },
  dividerLineText:{
    fontFamily: FONT.regular,
    color: COLORS.gray2,
    marginHorizontal: 10
  },
  regText: {
    fontFamily: FONT.regular,
    color: COLORS.primary
  }
});

export default styles;
