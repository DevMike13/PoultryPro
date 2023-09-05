import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: 20,
        // paddingHorizontal: 20,
        // paddingVertical: 40,
    },
    firstContainer:{
      flexDirection: "row",
      paddingVertical: 10,
      paddingHorizontal: 20,
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
    tempHumidityContainer1:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium,
    },
    tempHumidityContainer:{
        flex: 1,
        flexDirection: "row",
        gap: 10,
    },

    tempHumidityContent:{
        width: "50%",
        alignItems: "center",
        justifyContent: "center"
    },
    contentContainer:{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.lightWhite,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        marginVertical: 20,
        borderRadius: SIZES.medium,
        ...SHADOWS.medium
    },
    contentHeader:{
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
        marginTop: 30,
        marginBottom: 10
    },
    contentValueText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.xLarge   
    },

    addAndMinBtn:{
        backgroundColor: COLORS.gray,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.small
    },

    confirmBtn:{
        marginTop: 30,
        backgroundColor: COLORS.tertiary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: SIZES.medium
    },
    confirmBtnText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite
    },

    dateContainer:{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 50,
        gap: 10
    },
    dateText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium
    },
    divider:{
        width: 50,
        height: 2,
        backgroundColor: COLORS.primary,
        marginBottom: 30
    },

    // MODAL
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent black
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
      },
      modalText: {
        fontFamily: FONT.medium,
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      modalButton: {
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 5,
      },
      yesButton: {
        backgroundColor: COLORS.primary,
      },
      noButton: {
        backgroundColor: COLORS.tertiary,
      },
      modalButtonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: FONT.regular,
      },
});

export default styles;
