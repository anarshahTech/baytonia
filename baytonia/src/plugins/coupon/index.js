import React from 'react';
import { Text, Button, View, Input, Item, Toast, Accordion, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native'
import Identify from '@helper/Identify';
import NewConnection from '@base/network/NewConnection';
import Events from '@helper/config/events';
import { quoteitems, onepage } from '@helper/constants';
import { connect } from 'react-redux'
import material from '@theme/variables/material';

class Coupon extends React.Component {
    constructor(props) {
        super(props)
        this.parent = this.props.parent;

        if (this.props.is_cart) {
            couponCode = this.parent.props.data.total.coupon_code ? this.parent.props.data.total.coupon_code : '';
        } else {
            couponCode = this.parent.props.data.order.total.coupon_code ? this.parent.props.data.order.total.coupon_code : '';
        }
        this.state = {
            coupon: couponCode,
            useCouponCode: couponCode !== ''
        }
    }
    componentDidUpdate(nextProps, nextState) {
        let nextPropsTotal = this.props.is_cart ? nextProps.parent.props.data.total : nextProps.parent.props.data.order.total;
        if (nextPropsTotal.hasOwnProperty('coupon_code') && !this.state.useCouponCode) {
            this.setState({
                useCouponCode: true
            })
        }
    }
    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        data['reload_data'] = true;
        this.parent.setData(data);
        if (this.props.is_cart) {
            couponCode = data.total.coupon_code ? data.total.coupon_code : '';
        } else {
            couponCode = data.order.total.coupon_code ? data.order.total.coupon_code : '';
        }
        this.setState({ coupon: couponCode });
    }
    couponChange(code) {
        this.state.coupon = code
    }
    tracking() {
        let data = {};
        data['event'] = this.props.is_cart ? 'cart_action' : 'checkout_action';
        data['action'] = 'apply_coupon_code';
        data['coupon_code'] = this.state.coupon;
        Events.dispatchEventAction(data, this);
    }
    couponHandle(isRemove) {
        if (this.state.coupon === '') {
            Toast.show({ text: Identify.__('Please re-enter your code') + '!!', textStyle: { fontFamily: material.fontFamily } })
        } else {
            this.tracking()
            this.props.storeData('showLoading', { type: 'dialog' });
            let json = {};
            json['coupon_code'] = isRemove ? '' : this.state.coupon;
            new NewConnection()
                .init(this.props.is_cart ? quoteitems : onepage, 'apply_coupon', this, 'PUT')
                .addBodyData(json)
                .connect();
        }
    }
    _renderHeader(item, expanded) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
                onPress={() => {
                    this.setState(oldState => {
                        return {
                            useCouponCode: !oldState.useCouponCode
                        }
                    })
                }}
            >
                <Text style={{ fontFamily: material.fontBold }}>
                    {item.title}
                </Text>
                {expanded
                    ? <Icon style={{ fontSize: 18, color: '#c3c3c3' }} name="ios-arrow-up" />
                    : <Icon style={{ fontSize: 18, color: '#c3c3c3' }} name="ios-arrow-down" />}
            </TouchableOpacity>
        );
    }
    _renderContent(show) {
        let hasCouponCode = false;
        let couponCode = '';
        if (this.props.is_cart) {
            hasCouponCode = this.parent.props.data.total.coupon_code ? true : false;
            couponCode = this.parent.props.data.total.coupon_code ? this.parent.props.data.total.coupon_code : ''
        } else {
            hasCouponCode = this.parent.props.data.order.total.coupon_code ? true : false;
            couponCode = this.parent.props.data.order.total.coupon_code ? this.parent.props.data.order.total.coupon_code : ''
        }
        if (couponCode !== '') {
            this.state.coupon = couponCode;
        }
        if (show) {
            return (
                <View style={{ flex: 3, flexDirection: 'row', paddingTop: 15 }}>
                    <Item style={{ flex: 2, marginRight: 20, height: 45, borderBottomWidth: 2 }}>
                        <Input disabled={hasCouponCode} style={{ paddingStart: 10 }} placeholder={Identify.__('Enter a coupon code')} placeholderTextColor={Identify.hexToRgb(material.textColor, 0.65)} defaultValue={this.state.coupon} onChangeText={(code) => { this.couponChange(code) }} />
                    </Item>
                    <Button onPress={() => { this.couponHandle(hasCouponCode) }}><Text style={{ textAlign: 'center' }}>{hasCouponCode ? Identify.__('Remove') : Identify.__('Apply')}</Text></Button>
                </View>
            );
        }
    }

    render() {
        return (
            <View
                style={{
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 25,
                    marginBottom: 10
                }}
            >
                {this._renderHeader({ title: Identify.__('Coupon Code').toUpperCase() }, this.state.useCouponCode)}
                {this._renderContent(this.state.useCouponCode)}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return { loading: state.redux_data.showLoading };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Coupon);