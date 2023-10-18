import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../constants/theme";

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 30
  },
  icon:{
    width: 80,
    height: 80
  },
  headerContainer:{
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  headerTitle:{
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
  },
  logoutBtn:{
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: SIZES.small,
  },
  logoutBtnText:{
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.lightWhite
  },
  dateContainer:{
    
    alignItems: "flex-start",
    gap: 10
  },
  dateText:{
    fontFamily: FONT.medium,
    fontSize: SIZES.large
  },
  timeText:{
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    alignSelf: "center"
  },

//   CARD

  card:{
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.medium,
    flexDirection: "row",
    width: "90%",
    paddingVertical: SIZES.large,
    gap: 20,
    ...SHADOWS.medium
  },
  cardIcon:{
    width: "40%",
    alignItems: "center",
    justifyContent: "center"
  },
  cardData:{
    width: "60%",
    justifyContent: "center"
  },
  cardTitle:{
    fontFamily: FONT.medium,
    fontSize: SIZES.large
  },
  cardValueText:{
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge
  },
  cardMeasurementText:{
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: "#90EE90"
  }

});

export default styles;
