import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES, SHADOWS } from "../../../constants/theme";

const styles = StyleSheet.create({
    headerContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    icon:{
        width: 80,
        height:80
    },
    headerText:{
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge
    },

    // Nav container
    guideContainer:{
        backgroundColor: COLORS.lightWhite,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 20,
        borderRadius: SIZES.medium,
        width: "80%",
        ...SHADOWS.medium
    },
    guideTiles:{
        justifyContent: "center",
        alignItems: "center"
    },
    description:{
        width: "80%",
        marginVertical: 20,
        fontFamily: FONT.regular,
        alignItems: "center",
        justifyContent: "center",
    },

    footerContainer:{
        backgroundColor: COLORS.lightWhite,
        alignItems: "center",
        paddingVertical: 15,
        borderRadius: SIZES.medium,
        width: "80%",
        ...SHADOWS.medium
    },
    continueButton:{
        backgroundColor: COLORS.tertiary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: SIZES.small
    },
    buttonText:{
        fontFamily: FONT.medium,
        color: COLORS.lightWhite
    }
});

export default styles;
