import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    headerTitle:{
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        marginBottom: SIZES.large
    },
    chartContainer:{
        // alignItems: "center",
        // justifyContent: "center",
        marginBottom: 40
    }
});

export default styles;
