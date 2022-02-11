import { StyleSheet, Dimensions } from "react-native"

export default {
    details:{
        topLeft: {
            top: 0,
            left: 0,
        },
        topCenter: {
            top: 0,
            left: Dimensions.get('window').width / 2,
        },
        topRight: {
            top: 0,
            right: '14%',
        },
        middleLeft: {
            top: Dimensions.get('window').height / 4,
            left: 0,
        },
        middleCenter: {
            top: Dimensions.get('window').height / 4,
            left: Dimensions.get('window').width / 2,
        },
        middleRight: {
            top: Dimensions.get('window').height / 4,
            right: 0,
        },
        bottomLeft: {
            top: Dimensions.get('window').height / 2,
            left: 0,
        },
        bottomCenter: {
            top: Dimensions.get('window').height / 2,
            left: Dimensions.get('window').width / 2,
        },
        bottomRight: {
            top: Dimensions.get('window').height / 2,
            right: 0,
        }
    },
    gridview : {
        topLeft: {
            top: 0,
            left: 0,
        },
        topCenter: {
            top: 0,
            left: 50,
        },
        topRight: {
            top: 0,
            right: 0,
        },
        middleLeft: {
            top: 50,
            left: 0,
        },
        middleCenter: {
            top: 50,
            left: 50,
        },
        middleRight: {
            top: 50,
            right: 0,
        },
        bottomLeft: {
            bottom: 0,
            left: 0,
        },
        bottomCenter: {
            bottom: 0,
            left: 50,
        },
        bottomRight: {
            bottom: 0,
            right: 0,
        }
    },
    listview:{
        topLeft: {
            top: 0,
            left: 0,
        },
        topCenter: {
            top: 0,
            left: 150,
        },
        topRight: {
            top: 0,
            right: 0,
        },
        middleLeft: {
            top: 150,
            left: 0,
        },
        middleCenter: {
            top: 150,
            left: 150,
        },
        middleRight: {
            top: 150,
            right: 0,
        },
        bottomLeft: {
            bottom: 0,
            left: 0,
        },
        bottomCenter: {
            bottom: 0,
            left: 150,
        },
        bottomRight: {
            bottom: 0,
            right: 0,
        }
    }
};
