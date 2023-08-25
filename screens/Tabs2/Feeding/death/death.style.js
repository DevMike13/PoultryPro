import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        gap: 20,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    firstContainer:{
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 5,
        gap: 5
    },
    cycleContainer:{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.small,
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium
    },
    tempHumidityContainer1:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium,
    },
    tempHumidityContainer:{
        flex: 1,
        flexDirection: "row",
        gap: 10,
    },

    tempHumidityContent:{
        width: "50%",
        alignItems: "center",
        justifyContent: "center"
    },
    contentContainer:{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.lightWhite,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium
    },
    contentHeader:{
        fontFamily: FONT.bold,
        fontSize: SIZES.medium
    },
    contentValueText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.small   
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
        // flexDirection: "row",
        alignItems: "center",
        marginBottom: 50,
        gap: 10
    },
    dateText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium
    },
    divider:{
        width: 100,
        height: 2,
        backgroundColor: COLORS.primary
    }
});

export default styles;
