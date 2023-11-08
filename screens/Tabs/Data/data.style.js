import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants/theme";

const styles = StyleSheet.create({
    titleContainer:{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 15
    },
    headerTitle:{
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
    },
});

export default styles;
