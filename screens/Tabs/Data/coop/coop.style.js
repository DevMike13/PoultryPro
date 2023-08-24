import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        padding: 10,
        marginTop: 10
    },
    filterContainer:{
        backgroundColor: COLORS.lightWhite,
        paddingVertical: 20,
        marginTop: 10,
        borderRadius: SIZES.medium,
        marginHorizontal: 5,
        ...SHADOWS.medium
    },
    filterDateContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
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
    },
    dateText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium
    },
    filterBtn:{
        alignSelf: "flex-end", 
        flexDirection: "row", 
        gap: 10, 
        backgroundColor: COLORS.tertiary, 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: SIZES.small, 
        alignItems: "center"
    }

});

export default styles;
