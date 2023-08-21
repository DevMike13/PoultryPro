import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants/theme";

const styles = StyleSheet.create({
    titleContainer:{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 30
    },
    headerTitle:{
        fontFamily: FONT.bold,
        fontSize: SIZES.xxxLarge,
    },
});

export default styles;
