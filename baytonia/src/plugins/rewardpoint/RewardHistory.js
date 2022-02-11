import React from 'react';
import SimiPageComponent from "@base/components/SimiPageComponent";
import { Text, Spinner, Icon } from 'native-base';
import { ScrollView, FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import { reward_history } from '../constants';
import styles from './styles'

class RewardHistory extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.isBack = true;
        this.limit = 100;
        this.offset = 0;
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
        this.getRewardHistory()
    }

    getRewardHistory() {
        let params = [];
        params['limit'] = this.limit;
        params['offset'] = this.offset;
        try {
            new NewConnection()
                .init(reward_history, 'get_request_history', this)
                .addGetData(params)
                .connect();
        } catch (e) {
            console.log(e.message);
        }
    }

    setData(data) {
        this.setState({ data: data });
        this.props.storeData('showLoading', { type: 'none' })
    }

    renderItem = (item) => {
        return (
            <View icon style={styles.historyItem}>
                <View>
                    <Icon active name='md-checkmark-circle-outline' style={{ flex: 1, justifyContent: 'center' }} />
                </View>
                <View style={{ borderBottomWidth: 0.5, borderColor: '#4c4c4c', paddingBottom: 20, marginStart: 20, flex: 1 }}>
                    <Text>{item.title}</Text>
                    <Text style={{ fontWeight: '600' }}>{item.point_label}</Text>
                    <Text>{item.created_time}</Text>
                </View>
            </View>
        )
    }
    generatePropsToFlatlist() {
        return {
            style: { padding: 20 },
            data: this.state.data.simirewardpointstransactions,
            extraData: this.state.data
        }
    }
    createLayout() {
        if (this.state.data) {
            return (
                <ScrollView>
                    <FlatList
                        {...this.generatePropsToFlatlist()}
                        keyExtractor={(item) => item.transaction_id}
                        renderItem={({ item }) =>
                            this.renderItem(item)
                        }
                    />
                </ScrollView>
            );
        } else {
            return (<View />);
        }
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data };
};
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(RewardHistory);