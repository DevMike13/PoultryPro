import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        padding: 10,
        paddingTop: 30
    },
    createBtn:{
        width: "auto",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: SIZES.medium,
        gap: 20,
        width: "auto",
        backgroundColor: COLORS.tertiary
    },
    createBtnText:{
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.lightWhite
    },
    createContainer:{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        paddingVertical: 20,
        marginTop: 10,
        ...SHADOWS.medium
    },
    inputContainer: {
        width: 300,
        height: 80,
        paddingHorizontal: 20,
        marginVertical: 20,
        gap: 10,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium,
        height: "100%",
    },
    inInput: {
        fontFamily: FONT.regular,
        width: "100%",
        height: "60%",
        paddingHorizontal: SIZES.medium,
        alignItems: "center",
    },
    inputTitleText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium
    },
    cycleContainer:{
        paddingHorizontal: 10,
        paddingVertical: 15,
        width: 280,
        gap: 20
    },
    cycleContainerTitle:{
        fontFamily: FONT.bold,
        fontSize: SIZES.large
    },
    cycleDatesContainer:{
        flexDirection: "row"
    },
    cycleDateText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        backgroundColor: COLORS.gray,
        color: COLORS.lightWhite,
        paddingHorizontal: 10,
        borderRadius: SIZES.small
    },
    confirmBtn:{
        marginVertical: 20,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: SIZES.medium
    },
    confirmBtnText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite
    }
});

export default styles;
