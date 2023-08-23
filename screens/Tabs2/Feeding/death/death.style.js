import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        gap: 20,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    contentContainer:{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.lightWhite,
        paddingVertical: 20,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium
    },
    contentHeader:{
        fontFamily: FONT.bold,
        fontSize: SIZES.large
    },
    contentValueText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.large
    },

    addAndMinBtn:{
        backgroundColor: COLORS.gray,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.small
    },

    confirmBtn:{
        marginTop: 30,
        backgroundColor: COLORS.tertiary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: SIZES.medium
    },
    confirmBtnText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite
    },

    dateContainer:{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 60
    },
    dateText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium
    }
});

export default styles;
