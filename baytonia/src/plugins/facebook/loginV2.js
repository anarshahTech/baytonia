import React from 'react';
import { connect } from 'react-redux';
import SimiComponent from '@base/components/SimiComponent';
import { LoginButton, LoginManager, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk-next';
import { quoteitems, address_book_mode } from '@helper/constants';
import Connection from '@base/network/Connection';
import AppStorage from '@helper/storage';
import md5 from 'md5';
import NavigationManager from '@helper/NavigationManager';
import simicart from '@helper/simicart';
import Identify from '@helper/Identify';
import { Toast } from 'native-base';
import { Platform } from 'react-native';

class AddFBLogin extends SimiComponent {
    constructor(props) {
        super(props);
        this.shouldGetQuoteItems = false;
        this.customerData = null;
        this.email = '';
        this.simi_hash = '';
        LoginManager.logOut();
        if (Platform.OS === "android") {
            LoginManager.setLoginBehavior('NATIVE_ONLY'); 
        }
    }
    setData(data) {
        this.props.clearData();
        if (!this.shouldGetQuoteItems) {
            this.customerData = data;
            this.saveCustomerData();
            this.shouldGetQuoteItems = true;
            this.getQuoteItems();
        } else {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'customer_data', data: this.customerData.customer },
                { type: 'quoteitems', data: data }
            ]);
            this.navigate();
        }
    }
    handleWhenRequestFail() {
        if (this.logged) {
            LoginManager.logOut();
        }
        this.props.storeData('showLoading', { type: 'none' });
    }
    getQuoteItems() {
        Connection.restData();
        Connection.connect(quoteitems, this, 'GET');
    }
    
    saveCustomerData() {
        try {
            Identify.setCustomerData(this.customerData.customer);
            Identify.setCustomerParams({ email: this.email, simi_hash: this.customerData.customer.simi_hash });
            Connection.setCustomer({ email: this.email, simi_hash: this.customerData.customer.simi_hash });
            AppStorage.saveCustomerAutoLoginInfo({ email: this.email, simi_hash: this.customerData.customer.simi_hash });
        } catch (error) {
            // Error saving data
        }
    }
    navigate = () => {
        NavigationManager.backToRootPage(this.props.navigation);
        if (this.props.isCheckout) {
            NavigationManager.openPage(this.props.navigation, 'AddressBook', {
                isCheckout: true,
                mode: address_book_mode.checkout.select
            });
        }
    }
    renderPhoneLayout() {
        const that = this;
        return (
            <LoginButton
                style={{ width: '100%', marginTop: 17, height: 38, flex: 1, justifyContent: 'center' }}
                permissions={['email', 'user_photos', 'user_birthday']}
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            console.log("Request login has error: " + JSON.stringify(error));
                        } else if (result.isCancelled) {
                            console.log("Request login is cancelled.");
                        } else {
                            console.log('Login Success: ' + JSON.stringify(result));
                            AccessToken.getCurrentAccessToken().then(
                                (data) => {
                                    console.log(data.accessToken.toString());

                                    const callback = (error: ?Object, result: ?Object) => {
                                        if (error) {
                                            console.log('Error fetching data: ' + JSON.stringify(error.toString()));
                                        } else {
                                            console.log('Success fetching data: ' + JSON.stringify(result));
                                            this.logged = true;
                                        }

                                        let names = result.name.split(' ');

                                        that.email = result.email;

                                        //require: uid, providerId
                                        //optional: email, firstname, lastname

                                        let params = [];
                                        params['uid'] = result.id;
                                        params['providerId'] = 'facebook';
                                        if (that.email) {
                                            params['email'] = that.email;
                                        } else {
                                            params['email'] = result.id + '@facebook.com';
                                        }
                                        params['firstname'] = encodeURI(names[0]);
                                        if (names[1]) {
                                            params['lastname'] = encodeURI(names[1]);
                                        }

                                        if (params.hasOwnProperty('email') && params.email) {
                                            Connection.restData();
                                            Connection.setGetData(params);
                                            Connection.connect('simiconnector/rest/v2/sociallogins', that, 'GET');
                                            that.props.storeData('showLoading', { type: 'dialog' });
                                        } else {
                                            Toast.show({
                                                text: Identify.__('Cannot login with this account')
                                            })
                                        }
                                    };

                                    const infoRequest = new GraphRequest(
                                        '/me?fields=id,name,email,gender,birthday&access_token=' + data.accessToken.toString(),
                                        null,
                                        callback
                                    );
                                    // Start the graph request.
                                    new GraphRequestManager().addRequest(infoRequest).start();
                                }
                            );
                        }
                    }
                }
                onLogoutFinished={() => console.log("logout.")} />
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.customer_data };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        },
        clearData: () => {
            dispatch({ type: 'clear_all_data', data: null })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFBLogin);