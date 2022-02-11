import React from 'react';
import { connect } from 'react-redux';
import { BackHandler, Platform, Alert, Linking } from 'react-native';
import { Container, Icon, Fab } from 'native-base';
import variable from '@theme/variables/material';
import Identify from '@helper/Identify';
import { WebView } from 'react-native-webview';

class WebAppPage extends React.Component {

    constructor(props) {
        super(props);
        this.isPWA = (Identify.appConfig.app_settings.web_app_is_pwa && Identify.appConfig.app_settings.web_app_is_pwa == '1') ? true : false;
        if (Platform.OS === 'android') {
            this.props.navigation.addListener(
                'didFocus',
                () => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackAndroid);
                }
            );
            this.props.navigation.addListener(
                'willBlur',
                () => {
                    BackHandler.removeEventListener('hardwareBackPress', this.handleBackAndroid)
                }
            );
        }

        let url = this.props.navigation.getParam("uri");
        url = 'https://baytonia.com/?utm_source=hybrid_app&utm_medium=direct&utm_campaign=simicart';
        if (this.props.data) {
            url = this.props.data;
        }

        this.state = {
            url: url
        }
    }

    webView = {
        canGoBack: false,
        ref: null,
    }

    handleBackAndroid = () => {
        if (this.isPWA) {
            this.showAlertExit();
        } else {
            this.handleBackWebView();
        }
        return true
    }

    handleBackWebView() {
        if (this.webView.canGoBack && this.webView.ref) {
            this.webView.ref.goBack();
        } else {
            this.showAlertExit();
        }
    }

    showAlertExit() {
        Alert.alert(
            Identify.__('Warning'),
            Identify.__('Are you sure you want to exit app') + '?',
            [
                {
                    text: Identify.__('Cancel'), onPress: () => {
                        style: 'cancel'
                    }
                },
                {
                    text: Identify.__('OK'), onPress: () => {
                        BackHandler.exitApp()
                    }
                },
            ],
            { cancelable: true }
        )
    }

    _onNavigationStateChange(webViewState) {
        this.webView.canGoBack = webViewState.canGoBack;
        let url = webViewState.url;

        if (this.state.url != url) {
            this.state.url = '';
        }
        console.log(url)
        if (this.props.navigation.getParam("stoptask", null)) {
            let stopUrl = this.props.navigation.getParam("stopUrl");
            if (url == stopUrl) {
                this.props.navigation.goBack(null);
            }
        }
    }
    receiverNotification() {
        console.log('receiverNotification webApp');
        console.log(this.props.dataNoti);

        if (this.props.dataNoti && this.props.dataNoti.redirect && this.props.dataNoti.redirect.length > 0) {
            let urlRedirect = this.props.dataNoti.redirect;
            console.log('----------');
            console.log(urlRedirect);
            return urlRedirect;
        }
        return '';
    }

    render() {
        if (this.receiverNotification().length > 0 && this.state.url != this.receiverNotification()) {
            this.setState({
                url: this.receiverNotification()
            })
        }

        return (
            <Container style={{ marginTop: variable.isIphoneX ? 30 : Platform.OS === 'ios' ? 24 : 0 }}>
                <WebView
                    javaScriptEnabled={true}
                    originWhitelist={['*', 'http://*', 'https://*', 'intent://*']}
                    source={{ uri: this.state.url }}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    ref={(webView) => { this.webView.ref = webView; }}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                />
                {!this.isPWA && <Fab
                    containerStyle={{marginBottom: 40}}
                    style={{ backgroundColor: Identify.theme.button_background }}
                    position="bottomLeft"
                    onPress={() => {
                        if (this.webView.canGoBack && this.webView.ref) {
                            this.webView.ref.goBack();
                        }
                    }}>
                    <Icon name="ios-arrow-back" style={{ color: Identify.theme.button_text_color }} />
                </Fab>}
            </Container>
        );
    }

}

const mapStateToProps = state => ({
    data: state.redux_data.currentURL,
    dataNoti: state.redux_data.customize_noti
});

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (action, data) => {
            dispatch({ type: action, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WebAppPage);