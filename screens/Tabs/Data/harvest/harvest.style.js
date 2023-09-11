import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        marginTop: 10
    },
    headerTitle:{
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        marginBottom: SIZES.large
    },
    chartContainer:{
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
        marginTop: 50
    },

    // NEW
    firstContainer:{
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 5,
        gap: 5,
        zIndex: 10
    },
    cycleContainer:{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: SIZES.small,
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium
    },
    tempHumidityContainer:{
        justifyContent: "space-around",
        flexDirection: "row"
    },
    tempHumidityContent:{
        width: "50%",
        alignItems: "center",
        justifyContent: "center"
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
    },
    batchInfoContainer:{
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium,
    },
    batchContainerHeader:{
        marginBottom: 5
    },
    statusContainer:{
        flexDirection: "row",
        alignItems: "center",
        gap : 10,
        marginTop: 10
    }
});

export default styles;
