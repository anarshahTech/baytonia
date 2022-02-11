import React from 'react';
import SimiComponent from "../../core/base/components/SimiComponent";
import { Toast, Icon } from 'native-base';
import { Platform, Keyboard } from 'react-native';
import Voice from '@react-native-community/voice';
import Identify from '../../core/helper/Identify';
import material from "../../../native-base-theme/variables/material";

export default class VoiceSearch extends SimiComponent {
    constructor(props) {
        super(props);
        this.result = null;
        Voice.onSpeechStart = this.onSpeechStart.bind(this);
        Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
        Voice.onSpeechError = this.onSpeechError.bind(this);
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
    }
    onSpeechResults(result) {
        console.log('Void search result: ' + JSON.stringify(result));
        if (Platform.OS === 'ios') {
            Voice.stop();
        } else {
            Toast.toastInstance._root.closeToast();
        }
        if (result && result.value && this.props.obj.state.text == '') {
            let values = result.value;
            this.props.obj.state.text = values[0];
            this.props.obj.onEndEditing();
        }
    }
    onSpeechStart(result) {
        this.props.obj.state.text = '';
        Toast.show({
            text: 'Listening...',
            textStyle: {fontFamily: material.fontFamily},
            duration: 10000,
            onClose: () => {
                if (this.props.obj.state.text == '') {
                    Voice.cancel();
                }
            }
        });
    }
    onSpeechEnd(result) {
        Toast.toastInstance._root.closeToast();
    }
    onSpeechError(result) {
        console.log('error: ' + JSON.stringify(result));
        let message = Identify.__('No result');
        if (result && result.error.message) {
            let messagesArr = result.error.message.split('/');
            let returnMessage = messagesArr[1];
            if (returnMessage) {
                message = returnMessage;
            }
        }
        Toast.show({
            text: message,textStyle: {fontFamily: material.fontFamily},duration: 3000
        });
    }
    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
    }
    renderPhoneLayout() {
        return (
            <Icon style={{ marginLeft: 5, fontSize: 21, marginRight: 5, paddingLeft: 10 }}
                name='md-recording' onPress={() => {
                    Keyboard.dismiss();
                    Voice.start('en-US');
                }} />
        );
    }
}