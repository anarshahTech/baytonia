import React from 'react';
import SimiPageComponent from "@base/components/SimiPageComponent";
import { Text, Toast, Content, Container, View, Left, Right, Body, Icon, ListItem } from 'native-base';
import { Image } from 'react-native';
import NewConnection from '@base/network/NewConnection';
import { my_reward } from '../constants';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';
import styles from './styles'
import NavigationManager from '@helper/NavigationManager';
import material from "@theme/variables/material";

class MyReward extends SimiPageComponent {
    constructor(props) {
        super(props)
        this.isBack = true;
        this.state = {
            ...this.state,
            data: null
        }
    }

    componentWillMount() {
        if (this.props.data.showLoading.type === 'none' && !this.state.data) {
            this.props.storeData('showLoading', { type: 'full' })
        }
    }

    componentDidMount() {
        new NewConnection()
            .init(my_reward, 'get_reward_data', this)
            .connect();
    }

    setData(data, requestID) {
        this.props.storeData('showLoading', { type: 'none' })

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
            Toast.show({ text: text, duration: 3000, type: "warning", textStyle: { fontFamily: material.fontFamily } })
        } else {
            this.setState({ data: data });
        }
    }
    renderRewardDetailInfor(data) {
        return (
            <View
                style={{
                    flexGrow: 1,
                    borderRightWidth: 0.3,
                    borderColor: '#4c4c4c',
                    paddingEnd: 30,
                    marginLeft: 30
                }}
            >
                <Text style={{ fontSize: 35, textAlign: 'center', color: '#7a0000' }}>{data.loyalty_point}</Text>
                <Text style={{ textAlign: 'center' }}>{Identify.__('AVAILABLE POINTS')}</Text>
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#a8a8a8' }}>{Identify.__('Equal')} {data.loyalty_redeem} {Identify.__('to redeem')}</Text>
            </View>
        )
    }
    renderRewardRules(data) {
        let height = null
        return (
            <View>
                <View
                    style={{
                        flexGrow: 2,
                        marginRight: 30,
                        marginLeft: 30,
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    <Image onLayout={(event) => {
                        height = event.nativeEvent.layout.height
                    }}
                        style={styles.img} source={require('./img/ic_reward_coin.png')} />
                    <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 12,
                                textShadowColor: 'rgba(225, 225, 225, 0.75)',
                                textShadowOffset: { width: -2, height: 2 },
                                color: '#474747'
                            }}
                        >{data.spending_discount}</Text>
                    </View>
                </View>
                {data.spending_min !== '' && data.start_discount !== '' && <Text style={{ textAlign: 'center', fontSize: 14 }}>{data.spending_min} = {data.start_discount}</Text>}
            </View>
        )
    }
    renderRewardInfor = (data) => {
        return (
            <View style={styles.row}>
                {this.renderRewardDetailInfor(data)}
                {this.renderRewardRules(data)}
            </View>
        )
    }
    optionSelect(item, route) {
        NavigationManager.openPage(this.props.navigation, route, {
            userId: item.customer_id,
            data: item,
            reloadData: route == 'SettingReward' ? (data) => {
                this.setState({ data: data });
            } : undefined
        });
    }
    renderRewardOption = (icon, name, item, route) => {
        return (
            <ListItem icon style={{ ...styles.textInfor }}
                onPress={() => {
                    this.optionSelect(item, route)
                }}
            >
                <Left>
                    <Icon active name={icon} />
                </Left>
                <Body>
                    <Text>{name}</Text>
                </Body>
                <Right>
                    <Icon active name={Identify.isRtl() ? "ios-arrow-back" : 'ios-arrow-forward'} />
                </Right>
            </ListItem>
        )
    }

    renderEarnPointRule = (data) => {
        if (data.hasOwnProperty('earning_label') && data.hasOwnProperty('earning_policy')) {
            return (
                <View>
                    <View>
                        <Text style={{ ...styles.textPadding, ...styles.textLabel }}>{Identify.__(data.earning_label)}</Text>
                    </View>
                    <View>
                        <Text style={{ ...styles.textPadding, ...styles.textInfor }}>{Identify.__(data.earning_policy)}</Text>
                    </View>
                </View>
            )
        }
    }

    renderSpendPointRule = (data) => {
        if (data.hasOwnProperty('spending_label') && data.hasOwnProperty('spending_label')) {
            return (
                <View>
                    <View>
                        <Text style={{ ...styles.textPadding, ...styles.textLabel }}>{Identify.__(data.spending_label)}</Text>
                    </View>
                    <View>
                        <Text style={{ ...styles.textPadding, ...styles.textInfor }}>{Identify.__(data.spending_policy)}</Text>
                    </View>
                </View>
            )
        }
    }

    renderPolicies = (data) => {
        if (data.hasOwnProperty('policies')) {
            return (
                <View>
                    <View>
                        <Text style={{ ...styles.textPadding, ...styles.textLabel }}>{Identify.__('Our policies')}</Text>
                    </View>
                    <View>
                        <Text style={{ ...styles.textPadding, ...styles.textInfor }}>{data.policies[0]}</Text>
                    </View>
                </View>
            )
        }
    }

    renderView = () => {
        let data = this.state.data.simirewardpoint;
        return (
            <View >
                <View style={{ backgroundColor: 'white' }}>
                    {this.renderRewardInfor(data)}
                    {this.renderRewardOption('md-medal', Identify.__('Rewards History'), data, 'RewardHistory')}
                    {this.renderRewardOption('md-settings', Identify.__('Settings'), data, 'SettingReward')}
                </View>
                {this.renderEarnPointRule(data)}
                {this.renderSpendPointRule(data)}
                {this.renderPolicies(data)}
            </View>
        )
    }

    createLayout() {
        if (this.state.data) {
            return (
                <Container style={{ backgroundColor: '#eaeaea' }}>
                    <Content>
                        {this.renderView()}
                    </Content>
                </Container>
            )
        }
        return null;
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
export default connect(mapStateToProps, mapDispatchToProps)(MyReward);