import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants/theme";

const styles = StyleSheet.create({
    titleContainer:{
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 20,
        paddingTop: 15, 
        marginVertical: 20
    },
    headerTitle:{
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
    },
});

export default styles;
