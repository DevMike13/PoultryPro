import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        paddingTop: 60,
        gap: 80
    },
    toggleContainer:{
        justifyContent: "center",
        alignItems: "center"
    },
    toggleText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.xLarge
    }
    
});

export default styles;
