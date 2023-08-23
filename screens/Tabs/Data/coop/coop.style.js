import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        padding: 10
    },
    filterDateContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    firstContainer:{
        flexDirection: "row",
        paddingVertical: 30,
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
    tempHumidityContainer:{
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: 12,
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium,
        gap: 10
    },

    tempHumidityContent:{
        width: "50%",
        alignItems: "center",
        justifyContent: "center"
    },

    chartContainer:{
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40
    },

    chartHeaderContainer:{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: SIZES.small
    },
    chartTitle:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
    },
    chartDate:{
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        marginLeft: "auto"
    }

});

export default styles;
