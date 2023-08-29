import { StyleSheet } from "react-native";

import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants/theme";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        paddingTop: 30
    },
    createBtn:{
        width: "auto",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: SIZES.medium,
        gap: 20,
        width: "auto",
        backgroundColor: COLORS.tertiary
    },
    createBtnText:{
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.lightWhite
    },
    createContainer:{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightWhite,
        borderRadius: SIZES.medium,
        paddingVertical: 20,
        marginTop: 10,
        ...SHADOWS.medium
    },
    inputContainer: {
        width: 300,
        height: 80,
        paddingHorizontal: 20,
        marginVertical: 20,
        gap: 10,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium,
        height: "100%",
    },
    inInput: {
        fontFamily: FONT.regular,
        width: "100%",
        height: "60%",
        paddingHorizontal: SIZES.medium,
        alignItems: "center",
    },
    inputTitleText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium
    },
    cycleContainer:{
        paddingHorizontal: 10,
        paddingVertical: 15,
        width: 280,
        gap: 20
    },
    cycleContainerTitle:{
        fontFamily: FONT.bold,
        fontSize: SIZES.large
    },
    cycleDatesContainer:{
        flexDirection: "row"
    },
    cycleDateText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        backgroundColor: COLORS.gray,
        color: COLORS.lightWhite,
        paddingHorizontal: 10,
        borderRadius: SIZES.small
    },
    confirmBtn:{
        marginVertical: 20,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: SIZES.medium
    },
    confirmBtnText:{
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        color: COLORS.lightWhite
    },
    
    list:{
        backgroundColor: COLORS.lightWhite,
        ...SHADOWS.medium,
        flexDirection: "row",
        width:380,
        marginBottom: 20,
        borderRadius: SIZES.small,
    },
    batchContainer:{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    listInfo:{
        width: 200,
        justifyContent: "center",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        marginVertical: 10,
        gap: 10
    },
    scrollView:{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 15
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
