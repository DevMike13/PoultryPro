import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    dateContainer:{
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        gap: 20
    },
    dateText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium
    },
    confirmBtnContainer:{
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    confirmBtn:{
        width: 200,
        backgroundColor: COLORS.tertiary,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        borderRadius: SIZES.medium
    },
    confirmBtnText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite
    }
    
});

export default styles;
