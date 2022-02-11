import React from 'react';
import { Icon } from 'native-base';
import variable from "@theme/variables/material";
import Device from '@helper/device';
import NavigationManager from '@helper/NavigationManager';
import simicart from '@helper/simicart';

export default class CustomChatHeader extends React.Component {
    render() {
        let baseUrl = simicart.merchant_url;
        if (baseUrl.lastIndexOf('/') !== baseUrl.length - 1) {
            baseUrl += '/';
        }
        return (
            <Icon name='md-chatbubbles'
                style={{ fontSize: 23, color: variable.toolbarBtnColor, marginRight: Device.isTablet() ? 5 : 0, padding: 7, paddingLeft: 10, paddingRight: 10 }}
                onPress={() => {
                    NavigationManager.openPage(this.props.navigation, 'WebViewPage', {
                        uri: baseUrl + 'simiconnector/customchat/index'
                    });
                }} />
        );
    }
}