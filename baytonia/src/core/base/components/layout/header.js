import React from 'react';
import { View, Platform } from 'react-native';
import { Header } from 'native-base';
import { connect } from 'react-redux';
import Layout from '@helper/config/layout';
import md5 from 'md5';
import variable from "@theme/variables/material";
import Events from '@helper/config/events';
import Identify from '../../../helper/Identify';
import NavigationManager from '@helper/NavigationManager';

class HeaderApp extends React.Component {
    constructor(props) {
        super(props);
        this.toolbarHeight = variable.toolbarHeight;
        this.paddingTop = Platform.OS === 'ios' ? 18 : 0;

    }

    goBack() {
        if(!this.props.backAction()) {
            NavigationManager.backToPreviousPage(this.props.navigation);
        }
    }

    dispatchEventHeaderBefore() {
        let events = Events.events.app_header_before;

        let items = [];
        if (events) {
            for (let i = 0; i < events.length; i++) {
                let item = events[i];
                if (item.active == true) {
                    let Content = item.content;
                    items.push(<Content obj={this} />);
                }
            }
        }
        if (items.length > 0) {
            this.paddingTop = 5;
        }
        return items;
    }

    render() {
        let contents = Layout.layout.header_layout['content'];
        let components = [];
        for (let i = 0; i < contents.length; i++) {
            let element = contents[i];
            if (element.active == true) {
                let key = md5("content_header" + i);
                let Content = element.content;
                components.push(<Content
                    parent={this}
                    navigation={this.props.navigation}
                    key={key}
                />);
            }
        }
        let statusContentColor = {};
        if (Identify.theme) {
            statusContentColor = {
                iosBarStyle: Identify.theme.status_bar_text == '#ffffff' ? "light-content" : 'dark-content'
            }
        }
        return (
            <View>
                {this.dispatchEventHeaderBefore()}
                <Header {...statusContentColor} style={{ backgroundColor: variable.toolbarDefaultBg, height: this.toolbarHeight, paddingTop: this.paddingTop, borderBottomColor: variable.toolbarDefaultBg }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        {components}
                    </View>
                </Header>
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return { data: state.redux_data.quoteitems, customer_data: state.redux_data.customer_data };
}
// export default HeaderApp;
export default connect(mapStateToProps)(HeaderApp);
