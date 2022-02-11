import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'native-base'
import Identify from '../../../core/helper/Identify';
import SimiPageComponent from "@base/components/SimiPageComponent";
import material from '../../../../native-base-theme/variables/material';

class ForceUpdate extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.url = this.props.navigation.getParam('url');
    }

    pressButton() {
        Linking.openURL(this.url);
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{
                    padding: 15, paddingBottom: 10, paddingTop: 10, backgroundColor: Identify.theme.button_background
                }}
                    onPress={() => this.pressButton()}>
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold, color: 'white' }}>{Identify.__('Update Now')}!</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default ForceUpdate;
