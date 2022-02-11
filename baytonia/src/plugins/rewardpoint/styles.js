import { StyleSheet } from "react-native";
import { scale, verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 0.3,
        borderColor: '#4c4c4c'
    },
    img: {
        width: scale(60),
        height: scale(60)
    },
    textPadding:{
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    textLabel: {
        fontWeight: '600',
        backgroundColor: '#eaeaea',
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        borderColor: '#4c4c4c',
    },
    textInfor: {
        backgroundColor: 'white'
    },
    historyItem :{
        flex: 1,
        flexDirection: 'row',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 20
    },
    borderBottom: {
        borderBottomWidth: 0.2,
        borderColor: '#4c4c4c',
        padding: 12
    }
})