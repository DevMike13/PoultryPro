import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    headerTitle:{
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
        marginBottom: SIZES.large
    },
    chartContainer:{
        // alignItems: "center",
        justifyContent: "center",
        marginBottom: 40
    },
    batchText:{
        fontFamily: FONT.bold, 
        fontSize: SIZES.medium, 
        backgroundColor: COLORS.gray, 
        paddingHorizontal: 10, 
        borderRadius: SIZES.small, 
        color: COLORS.lightWhite,
        marginVertical: 10,
        ...SHADOWS.medium
    },
    cycleContainer:{
        alignSelf: 'center',
        width: '50%',
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: SIZES.small,
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium,
        marginBottom: 30,
    },
});

export default styles;
