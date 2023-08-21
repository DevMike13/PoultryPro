import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES, SHADOWS } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: SIZES.xLarge,
        backgroundColor: COLORS.gray3
    },
    btn: (name, activeTab) => ({
      paddingVertical: SIZES.small,
      paddingHorizontal: SIZES.xLarge,
      backgroundColor: name === activeTab ? COLORS.primary : "#F3F4F8",
      borderRadius: SIZES.xLarge,
      marginLeft: 2,
      ...SHADOWS.medium,
      shadowColor: COLORS.white,
    }),
    btnText: (name, activeTab) => ({
      fontFamily: "DMMedium",
      fontSize: SIZES.small,
      color: name === activeTab ? COLORS.lightWhite : "#AAA9B8",
    }),
});

export default styles;
