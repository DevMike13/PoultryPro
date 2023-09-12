import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: 5
    },
    toggleContainer:{
        justifyContent: "center",
        alignItems: "center"
    },
    toggleText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.large
    },
    manualBtn:{
        backgroundColor: COLORS.tertiary,
        width: 150,
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
        paddingVertical: 20,
        borderRadius: SIZES.small,
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        marginTop: 10,
        ...SHADOWS.medium
    },
    radioContianer:{
        marginHorizontal: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: SIZES.medium,
        backgroundColor: COLORS.lightWhite,
        marginTop: 30,
        ...SHADOWS.medium
    },
    startBtn:{
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingVertical: 10,
        marginTop: 50,
        marginBottom: 10,
        borderRadius: SIZES.medium,
        backgroundColor: COLORS.tertiary
    },
    startBtnText:{
        fontFamily: FONT.medium,
        color: COLORS.lightWhite
    },

    dateContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    
    scheduleContainer:{
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-around"
    },
    timeContainer:{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      gap: 20
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
