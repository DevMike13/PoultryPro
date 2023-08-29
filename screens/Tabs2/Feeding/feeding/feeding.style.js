import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        paddingTop: 30,
        gap: 5
    },
    toggleContainer:{
        justifyContent: "center",
        alignItems: "center"
    },
    toggleText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.large
    },
    manualBtn:{
        backgroundColor: COLORS.tertiary,
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 10,
        borderRadius: SIZES.small,
        marginHorizontal: 15,
        gap: 10
    },
    manualBtnText:{
        color: COLORS.lightWhite,
        fontFamily: FONT.medium
    },
    animatedContainer:{
        backgroundColor: COLORS.lightWhite,
        marginHorizontal: SIZES.medium,
        paddingVertical: 20,
        borderRadius: SIZES.small,
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        ...SHADOWS.medium
    },
    radioContianer:{
        marginHorizontal: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: SIZES.medium,
        backgroundColor: COLORS.lightWhite,
        marginTop: 30,
        ...SHADOWS.medium
    },
    startBtn:{
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingVertical: 10,
        marginTop: 10,
        borderRadius: SIZES.medium,
        backgroundColor: COLORS.tertiary
    },
    startBtnText:{
        fontFamily: FONT.medium,
        color: COLORS.lightWhite
    }
    
});

export default styles;
