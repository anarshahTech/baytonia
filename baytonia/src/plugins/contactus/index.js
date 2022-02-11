import React from 'react';
import { Linking, TouchableOpacity, FlatList, View, StyleSheet } from 'react-native';
import { Container, Text, Icon } from "native-base";
import Identify from '@helper/Identify';
import SimiPageComponent from "@base/components/SimiPageComponent";

export default class ContactUs extends SimiPageComponent {
    constructor(props) {
        super(props)
    }

    createData() {
        const merchantConfig = Identify.getMerchantConfig()
        if (!merchantConfig || !merchantConfig.storeview.instant_contact) {
            return;
        }

        const instantConfig = merchantConfig.storeview.instant_contact;
        this.isGrid = parseInt(instantConfig.style, 10);
        this.activeColor = instantConfig.activecolor ? '#' + instantConfig.activecolor : '#FF9900'

        let contactItems = []
        if (instantConfig.email && instantConfig.email != '') {
            instantConfig.email.map(item => {
                contactItems.push({
                    link: 'mailto:' + item,
                    title: (instantConfig.email.length == 1) ? Identify.__('Email') : Identify.__('Email') + item,
                    icon: 'ios-mail'
                })
            })
        }

        if (instantConfig.phone && instantConfig.phone != '') {
            instantConfig.phone.map(item => {
                contactItems.push({
                    link: 'tel:' + item,
                    title: (instantConfig.phone.length == 1) ? Identify.__('Call') : Identify.__('Call') + item,
                    icon: 'ios-call'
                })
                return null
            })
        }

        if (instantConfig.message && instantConfig.message != '') {
            instantConfig.message.map(item => {
                contactItems.push({
                    link: 'sms:' + item,
                    title: (instantConfig.message.length == 1) ? Identify.__('Message') : Identify.__('Message') + item,
                    icon: 'ios-chatboxes'
                })
                return null
            })
        }

        if (instantConfig.website && instantConfig.website != '') {
            contactItems.push({
                link: instantConfig.website,
                title: Identify.__('Website'),
                icon: 'ios-globe'
            })
        }
        return contactItems;
    }

    renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => Linking.openURL(item.link)}
                style={this.isGrid ? styles.itemGrid : styles.itemList}>
                <Icon name={item.icon}
                    style={
                        [
                            this.isGrid ? styles.gridItemIcon : {},
                            {
                                fontSize: 30,
                                color: this.activeColor,
                                borderColor: this.isGrid ? this.activeColor : 'transparent'
                            }
                        ]
                    }
                />
                <Text style={this.isGrid ? styles.titleGrid : styles.titleList}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    renderPhoneLayout() {
        let data = this.createData();
        if (!data) {
            return;
        }
        return (
            <Container>
                <FlatList
                    contentContainerStyle={{
                        paddingLeft: 20,
                        paddingRight: 20
                    }}
                    data={data}
                    renderItem={({ item }) => this.renderItem(item)}
                    numColumns={this.isGrid ? 2 : 1}
                    keyExtractor={(item, index) => index.toString()}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    itemGrid: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '36%',
        height: 150,
    },
    itemList: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center'
    },
    gridItemIcon: {
        borderWidth: 1,
        width: 60,
        height: 60,
        borderRadius: 30,
        paddingTop: 14,
        textAlign: 'center',
        fontSize: 30
    },
    titleGrid: {
        marginTop: 15,
        fontSize: 15
    },
    titleList: {
        marginLeft: 15,
        fontSize: 15
    }
})