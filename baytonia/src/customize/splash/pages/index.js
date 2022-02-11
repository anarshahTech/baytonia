import React from 'react';
import { View } from 'react-native';
import AppSettings from '../../../core/screens/splash/components/merchant';
import DashboardSettings from '../../../core/screens/splash/components/dashboard';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';
import Redirect from '../../../core/screens/splash/pages/redirect';
import md5 from 'md5';
import { NetworkApp } from "@base/components/layout/config";
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from "@base/components/SimiPageComponent";
import Events from '@helper/config/events';
import ImageSplash from '../../../core/screens/splash/components/image';
import simiCart from '@helper/simicart';
import SplashScreen from 'react-native-splash-screen'
import AppStorage from '@helper/storage';
import NewConnection from '@base/network/NewConnection';
import Connection from '@base/network/Connection';
import { quoteitems, customer_login } from '@helper/constants';
import compareVersions from 'compare-versions';
import VersionCheck from 'react-native-version-check';

class Splash extends SimiPageComponent {
    constructor(props, context) {
        super(props);
        this.key_1 = md5("splash_key_1");
        this.key_2 = md5("splash_key_2");
        this.isForceLogin = false;
        this.lockPortrait = false;
        this.lockLandscape = false;
        this.url = null;
        this.state = {
            needUpdate : null,
            ... this.state
        }
        if (Platform.OS === 'android') {
            this.getAppInforAndroid()
        } else {
            this.getAppInforIos()
        }
    }

    getAppInforIos() {
        fetch('http://itunes.apple.com/lookup?bundleId=' + simiCart.appID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                let errors = {};
                errors['errors'] = [
                    { message: Identify.__('Network response was not ok') }
                ]
                return errors;
            }).then(data => {
                if (data.errors) {
                    console.log(data.errors);
                    this.setState({needUpdate : false})
                } else if (data.results.length > 0 && this.isNeedUpdate(simiCart.appVersion, data.results[0].version)) {
                    this.url = data.results[0].trackViewUrl;
                    this.setState({needUpdate : true})
                } else {
                    this.setState({needUpdate : false})
                }
            }).catch(error => {
                this.setState({needUpdate : false})
                console.log(error)
            })
    }

    isNeedUpdate(currentVersion, appVersion) {
        return compareVersions(currentVersion, appVersion) == -1;
    }

    getAppInforAndroid() {
        VersionCheck.needUpdate()
            .then(async res => {
                if (res && res.isNeeded) {
                    VersionCheck.getPlayStoreUrl().then(url => {
                        this.url = url;
                        this.setState({needUpdate : true})
                    })
                } else {
                    this.setState({needUpdate : false})
                }
            }).catch((error) => {
                this.setState({needUpdate : false})
                console.log(error);
            });
    }

    static navigationOptions = () => {
        let drawerLockMode = 'locked-closed';
        return {
            drawerLockMode,
        };
    };

    dispatchSplashCompleted() {
        for (let i = 0; i < Events.events.splash_completed.length; i++) {
            let node = Events.events.splash_completed[i];
            if (node.active === true) {
                let action = node.action;
                action.onSplashCompleted();
            }
            if (node.force_login && node.force_login === true) {
                this.isForceLogin = true
            }

            if (node.lock_portrait && node.lock_portrait === true) {
                this.lockPortrait = node.lock_portrait
            }

            if (node.lock_landscape && node.lock_landscape === true) {
                this.lockLandscape = node.lock_landscape
            }
        }
    }

    autoLogin() {
        AppStorage.getCustomerAutoLoginInfo().then((customerInfo) => {
            if (customerInfo !== null) {
                if (customerInfo.email) {
                    this.email = customerInfo.email;
                }
                let putSimiHash = false;
                if (customerInfo.password) {
                    this.password = customerInfo.password;
                }
                if (customerInfo.simi_hash && customerInfo.simi_hash.length > 0) {
                    putSimiHash = true;
                    this.simi_hash = customerInfo.simi_hash;
                }

                if (this.email !== '' && (this.simi_hash !== '' || this.password !== '')) {
                    try {
                        Connection.setCustomer(null);
                        Identify.setCustomerParams(null);
                        let data = {
                            email: this.email,
                            simi_hash: this.password
                        }
                        if (putSimiHash) {
                            data = {
                                email: this.email,
                                simi_hash: this.simi_hash
                            }
                        }

                        new NewConnection()
                            .init(customer_login, 'customer_login', this)
                            .addGetData(data)
                            .setShowErrorAlert(false)
                            .connect();
                    } catch (e) {
                        console.log(e.message);
                    }
                } else {
                    this.forceLogin();
                    this.getQuoteItems(true);
                }
            } else {
                this.forceLogin();
                this.getQuoteItems(true);
            }
            //this callback is executed when your Promise is resolved
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
            this.getQuoteItems(true);
        });
    }

    getQuoteItems(notLogin) {
        newConnection = new NewConnection();
        newConnection.init(quoteitems, 'get_quoteitems', this);
        newConnection.connect();
    }

    forceLogin() {
        if (Identify.getMerchantConfig().storeview.base.force_login && Identify.getMerchantConfig().storeview.base.force_login == '1') {
            this.isForceLogin = true;
        }
        if (Identify.isEmpty(this.props.customer_data) && this.isForceLogin === true) {
            NavigationManager.openPage(this.props.navigation, 'Login');
            return null
        }
    }

    setData(data, requestID) {
        if (requestID == "customer_login") {
            this.customer = data.customer;
            let dataCustomer = {
                email: this.email,
                password: this.password
            };
            if (this.customer.simi_hash && this.customer.simi_hash != '') {
                dataCustomer['simi_hash'] = this.customer.simi_hash;
            }
            Connection.setCustomer(dataCustomer);   // For old customization
            Identify.setCustomerParams(dataCustomer);
            Identify.setCustomerData(this.customer);
            AppStorage.saveData('quote_id', '');
            this.props.storeData('actions', [
                { type: 'customer_data', data: this.customer }
            ]);
            this.getQuoteItems(false);
            this.tracking();
        } else if (requestID == 'get_quoteitems') {
            this.props.storeData('quoteitems', data);
        }
    }

    render() {
        Identify.initCreditCardData();
        NavigationManager.saveNavigation(this.props.navigation);
        if (Identify.isEmpty(this.props.merchant_configs)
            || Identify.isEmpty(this.props.dashboard_configs) || this.state.needUpdate === null) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: simiCart.colorSplash
                }}>
                    <ImageSplash />
                    <AppSettings isLoading={false} key={this.key_1} />
                    <DashboardSettings isLoading={false} key={this.key_2} />
                    <NetworkApp />
                </View>
            );
        }
        console.log('chau');
        console.log(this.state.needUpdate);
        if (this.state.needUpdate) {
            NavigationManager.openRootPage(this.props.navigation, 'ForceUpdate', {
                url: this.url
            });
            return null;
        }

        if (!Identify.getCustomerData()) {
            this.autoLogin();
        }
        this.dispatchSplashCompleted();
        if (this.props.dashboard_configs['app-configs'][0]) {
            if (!this.props.dashboard_configs['app-configs'][0].is_active) {
                SplashScreen.hide();
                NavigationManager.openRootPage(this.props.navigation, 'Maintain');
                return null;
            }
        }

        return (
            <Redirect navigation={this.props.navigation} />
        );
    }

    tracking() {
        let data = {};
        data['event'] = 'login_action';
        data['action'] = 'login_success';
        data['method'] = 'normal';
        Events.dispatchEventAction(data, this);
    }
}

const mapStateToProps = (state) => {
    return {
        merchant_configs: state.redux_data.merchant_configs,
        dashboard_configs: state.redux_data.dashboard_configs,
        customer_data: state.redux_data.customer_data
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

// export default Splash;
export default connect(mapStateToProps, mapDispatchToProps)(Splash);
