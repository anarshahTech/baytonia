import React from 'react';
import SimiPageComponent from "@base/components/SimiPageComponent";
import { Text, Switch, View, Container, Content, Button, Toast } from 'native-base'
import Identify from "@helper/Identify";
import styles from './styles';
import NewConnection from '@base/network/NewConnection';
import { reward_setting } from '../constants';
import { connect } from 'react-redux';
import NavigationManager from '@helper/NavigationManager';

class SettingReward extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.isBack = true;
        this.rewardData = this.props.navigation.getParam('data');
        this.reloadDataCallback = this.props.navigation.getParam('reloadData');
        this.state = {
            ...this.state,
            update_point: this.rewardData.is_notification === 1,
            expired_point: this.rewardData.expire_notification === 1,
        }
        this.saveSetting = false;
    }

    setData(data) {
        console.log(data);
        if (data.errors) {
            let errors = data.errors;
            let text = "";
            for (let i in errors) {
                let error = errors[i];
                text += error.message + ' ';
            }
            if (text === "") {
                text = Identify.__('Something went wrong')
            }
            console.warn(text);
        } else {
            if (this.saveSetting) {
                this.saveSetting = false;
                this.props.storeData('showLoading', { type: 'none' })
                NavigationManager.backToPreviousPage(this.props.navigation);
                this.reloadDataCallback(data);
            }
        }
    }

    handleChangeToggle(type = 1) {
        if (type === 1) {
            this.setState({ update_point: !this.state.update_point })
        }
        if (type === 2) {
            this.setState({ expired_point: !this.state.expired_point })
        }
    }

    handleSaveSetting() {
        this.saveSetting = true;
        let json = {
            is_notification: 0,
            expire_notification: 0
        }
        if (this.state.update_point) {
            json.is_notification = 1
        }
        if (this.state.expired_point) {
            json.expire_notification = 1
        }
        new NewConnection()
            .init(reward_setting, 'reward_save_setting', this, 'PUT')
            .addBodyData(json)
            .connect();
        this.props.storeData('showLoading', { type: 'dialog' })
    }
    renderSettingLayout(title, label, type, state) {
        return (
            <View>
                <View style={{ ...styles.borderBottom, flex: 1, flexDirection: 'row' }}>
                    <Text style={{ fontWeight: '100', flexGrow: 2, fontSize: 14 }}>{title}</Text>
                    <Switch
                        value={state}
                        onValueChange={() => this.handleChangeToggle(type)}
                    />
                </View>
                <View style={{ ...styles.borderBottom }}>
                    <Text style={{ fontSize: 13 }}>{label}</Text>
                </View>
            </View>
        )
    }
    renderSaveButton() {
        return (
            <Button
                style={{ position: 'absolute', bottom: 0, width: '100%', height: 50, justifyContent: 'center' }}
                onPress={() => this.handleSaveSetting()}
                title={Identify.__('SAVE')}
            >
                <Text style={{ fontWeight: '800', textAlign: 'center' }}>{Identify.__('SAVE')}</Text>
            </Button>
        )
    }
    createLayout() {
        return (
            <Container>
                <Content>
                    <View style={{ ...styles.borderBottom }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{Identify.__('Email Subscriptions')}</Text>
                    </View>
                    {this.renderSettingLayout(Identify.__('Point balance Update'), Identify.__('Subscribe to receive updates on your point balance'), 1, this.state.update_point)}
                    {this.renderSettingLayout(Identify.__('Expired Point Transaction'), Identify.__('Subscribe to receive notifications of expiring points in advance'), 2, this.state.expired_point)}
                </Content>
                {this.renderSaveButton()}
            </Container>
        )
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingReward);