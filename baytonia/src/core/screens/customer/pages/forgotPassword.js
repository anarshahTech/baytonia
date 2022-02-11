import React from 'react'
import SimiPageComponent from "@base/components/SimiPageComponent";
import Identify from "@helper/Identify";
import { Container, Content, Form, Item, Input, Label, H3, Text, Button, Toast } from 'native-base';
import { forgotpassword } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from "@helper/NavigationManager";
import Events from '@helper/config/events';
import material from "@theme/variables/material";

export default class ForgotPassWordPage extends SimiPageComponent {
    constructor(props) {
        super(props)
        this.isBack = true
        this.state = {
            ...this.state,
            email: ''
        };
        this.dispatchSplashCompleted();
    }

    dispatchSplashCompleted() {
        if (Identify.getMerchantConfig().storeview.base.force_login && Identify.getMerchantConfig().storeview.base.force_login == '1') {
            this.isRight = false;
            this.isMenu = false;
        }

        for (let i = 0; i < Events.events.splash_completed.length; i++) {
            let node = Events.events.splash_completed[i];
            if (node.force_login && node.force_login === true) {
                this.isRight = false;
                this.isMenu = false;
            }
        }
    }

    validateEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false)
            return false;
        else
            return true;
    }

    setData(data, requestID) {
        if (!data.errors) {
            Toast.show({ text: Identify.__('Please check your email to reset password'), type: "success", duration: 3000, textStyle: { fontFamily: material.fontFamily } })
            NavigationManager.backToPreviousPage(this.props.navigation)
        }
    }

    resetPassword = () => {
        if (this.state.email === '' || this.state.email === null) {
            Toast.show({ text: Identify.__('This field is required'), duration: 3000, type: 'warning', textStyle: { fontFamily: material.fontFamily } })
        } else {
            if (this.validateEmail(this.state.email)) {
                let param = {
                    email: this.state.email
                }
                new NewConnection()
                    .init(forgotpassword, 'reset_password', this)
                    .addGetData(param)
                    .connect();
            } else {
                this.setState({ email: '' });
                Toast.show({ text: Identify.__('Check your email and try again'), duration: 3000, type: 'warning', textStyle: { fontFamily: material.fontFamily } })
            }
        }
    }

    renderFormForgot = () => {
        return <Form style={{ marginLeft: Identify.isRtl() ? 20 : 0 }}>
            <Label style={{ width: '100%' }}>{Identify.__('Enter Your Email').toUpperCase()}</Label>
            <Input
                style={{
                    flex: 1,
                    borderWidth: 0.5,
                    borderColor: '#c3c3c3',
                    paddingStart: 15,
                    paddingEnd: 15,
                    height: 40,
                    marginTop: 15
                }}
                placeholder={Identify.__('Email')}
                value={this.state.email}
                onChangeText={(text) => { this.setState({ email: text }); }} />
            <Button
                disabled={!this.validateEmail(this.state.email)}
                style={{ width: '100%', marginTop: 15, justifyContent: 'center' }}
                title='reset password'
                onPress={() => { this.resetPassword() }}
            >
                <Text style={{ textAlign: 'center' }}>{Identify.__('Reset my password')}</Text>
            </Button>
        </Form>
    }

    renderPhoneLayout() {
        return (
            <Container>
                <Content style={{ padding: 12 }}>
                    {this.renderFormForgot()}
                </Content>
            </Container>
        )
    }
}