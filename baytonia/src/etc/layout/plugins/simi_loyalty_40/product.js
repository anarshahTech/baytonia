export default {
    container: {

    },
    content: {
        simi_reward: {
            active: true,
            sort_order: 2001,
            content: require('../../../../plugins/rewardpoint/RewardLabel').default,
            data: {
                isProduct : true
            },
            position: 'right'
        }
    }
}
