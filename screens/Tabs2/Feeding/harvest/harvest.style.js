import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        gap: 20,
        paddingHorizontal: 20,
        paddingVertical: 30,
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
        marginHorizontal: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium,
        height: "100%",
    },
    inInput: {
        fontFamily: FONT.regular,
        width: "60%",
        height: "60%",
        paddingHorizontal: SIZES.medium,
        alignItems: "center",
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
        justifyContent: "center",
        marginTop: 10
    },
    dateText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium
    }
    
});

export default styles;
