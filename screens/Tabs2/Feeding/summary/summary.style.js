import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: 20,
        // paddingHorizontal: 20,
        // paddingVertical: 30,
    },
    firstContainer:{
        flexDirection: "row",
        //paddingVertical: 10,
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
    contentValueText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.xLarge   
    },

    // CURREN DAYS
    currentDaysContainer:{
        width: 370,
        backgroundColor: COLORS.lightWhite,
        marginHorizontal: 20,
        alignSelf: "center",
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium,
        ...SHADOWS.medium
    },
    
    manualBtn:{
        backgroundColor: COLORS.tertiary,
        width: 180,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 10,
        borderRadius: SIZES.small,
        marginHorizontal: 15,
        gap: 10
    },
    manualBtnText:{
        color: COLORS.lightWhite,
        fontFamily: FONT.medium
    },
    animatedContainer:{
        backgroundColor: COLORS.lightWhite,
        marginHorizontal: SIZES.medium,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: SIZES.small,
        justifyContent: "center",
        // alignItems: "center",
        ...SHADOWS.medium
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
